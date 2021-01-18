import { ImageSourcePropType } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { AVPlaybackSource } from 'expo-av/build/AV'
import {
  experimentSelector,
  currentModuleSelector,
  allModulesSelector,
} from '@redux/selectors'
import {
  nextModule,
  updateModule,
  clearAllEvents,
  clearAllModules,
  clearExperiment,
  updateExperiment,
  rejectParticipant,
  ExperimentCache,
  RejectionReason,
} from '@redux/reducers'
import { syncExperiment } from '@redux/actions'
import { LoginScreen, RejectionScreen } from '@screens'
import { TermsContainer } from './TermsContainer'
import { CriterionContainer } from './CriterionContainer'
import { FearConditioningContainer } from './FearConditioningContainer'
import { VolumeCalibrationContainer } from './VolumeCalibrationContainer'
import { InstructionsContainer } from './InstructionsContainer'
import { BasicInfoContainer } from './BasicInfoContainer'
import { SummaryScreen } from '@screens/SummaryScreen'
import { ExternalLinkContainer } from './ExternalLinkContainer'
import { AffectiveRatingContainer } from './AffectiveRatingContainer'
import { TextContainer } from './TextContainer'
import {
  useUnconditionalStimulus,
  UnconditionalStimulusRef,
} from '@utils/hooks'
import { BreakStartContainer } from './BreakStartContainer'
import { BreakEndContainer } from './BreakEndContainer'
import { TaskInstructionsContainer } from './TaskInstructionsContainer'

const ExperimentModuleTypes = {
  BASIC_INFO: BasicInfoContainer,
  WEB: ExternalLinkContainer,
  TERMS: TermsContainer,
  CRITERION: CriterionContainer,
  INSTRUCTIONS: InstructionsContainer,
  TASK_INSTRUCTIONS: TaskInstructionsContainer,
  VOLUME_CALIBRATION: VolumeCalibrationContainer,
  FEAR_CONDITIONING: FearConditioningContainer,
  AFFECTIVE_RATING: AffectiveRatingContainer,
  TEXT: TextContainer,
  BREAK_START: BreakStartContainer,
  BREAK_END: BreakEndContainer,
}

type ExperimentModuleConfig = {
  id: string
  moduleType: string
  definition?: Object
}

export type VisualStimuli = {
  image: ImageSourcePropType
  label: string
}

export type Experiment = {
  id: number
  name: string
  description: string
  contactEmail?: string
  modules: ExperimentModuleConfig[]
  ratingDelay: number
  trialLength: number
  ratingScaleAnchorLabelLeft: string
  ratingScaleAnchorLabelCenter: string
  ratingScaleAnchorLabelRight: string
  intervalTimeBounds: {
    min: number
    max: number
  }
  // Store URI of assets
  unconditionalStimulus:
    | {
        uri: string
      }
    | AVPlaybackSource
  contextStimuli: { [key: string]: ImageSourcePropType }
  conditionalStimuli: { [key: string]: VisualStimuli }
  generalisationStimuli: VisualStimuli[]
}

export type ExperimentModule<
  ModuleState = Object,
  ExtraProps = Object
> = React.FunctionComponent<
  ExtraProps & {
    module: ModuleState
    updateModule: (ModuleState) => void
    updateExperiment: (Object) => void
    experiment: ExperimentCache
    onModuleComplete: () => void
    unconditionalStimulus?: UnconditionalStimulusRef
    terminateExperiment: (boolean, RejectionReason) => void
    exitExperiment: (RejectionReason) => void
  }
>

export const ExperimentContainer = () => {
  // Get the experiment object and the index of the current module.
  const dispatch = useDispatch()
  const experiment = useSelector(experimentSelector)
  const experimentModules = useSelector(allModulesSelector)
  const currentModule = useSelector(currentModuleSelector)
  const usRef = useUnconditionalStimulus()

  // If the user has been 'screened out' then show respective screen
  if (experiment.rejectionReason) {
    return (
      <RejectionScreen
        contactLink={experiment.contactEmail}
        reason={experiment.rejectionReason}
        onExit={() => terminateExperiment(false)}
      />
    )
  }

  // If all modules have been completed...
  if (experiment.currentModuleIndex === experiment.definition?.modules.length) {
    // Mark experiment complete
    if (!experiment.isComplete)
      dispatch(
        updateExperiment({
          ...experiment,
          isComplete: true,
        }),
      )

    // Are all the modules synced?
    if (!experiment.offlineOnly) {
      return (
        <SummaryScreen
          modules={experimentModules}
          syncExperiment={() => dispatch(syncExperiment)}
          onExit={() => terminateExperiment(false)}
        />
      )
    } else {
      terminateExperiment(false)
    }

    // Render nothing...
    return null
  }

  // If no experiment saved then return the login
  if (experiment.definition == undefined || currentModule == undefined) {
    return <LoginScreen />
  }

  // If the sound file is corrupt then terminate
  if (usRef !== undefined && usRef?.duration === 0) {
    terminateExperiment(true, 'CORRUPT_ASSETS')
  }

  // Get the current module data and it's respective component.
  const ModuleComponent: ExperimentModule =
    ExperimentModuleTypes[currentModule?.moduleType]

  // This function is called when the experiment should transition to next module.
  function onModuleComplete(updatedModuleState = {}) {
    // Mark current module as complete
    dispatch(
      updateModule({
        ...currentModule,
        moduleState: {
          ...currentModule.moduleState,
          ...updatedModuleState,
        },
        moduleCompleted: true,
      }),
    )

    // Proceed to next module
    dispatch(nextModule())

    // Sync past screen data
    dispatch(syncExperiment)
  }

  // If no matching component then skip it (this avoids issues caused by upgrades)
  if (ModuleComponent === undefined) {
    onModuleComplete()
    return null
  }

  // Function used to reset experiment state
  function terminateExperiment(
    redirect = true,
    rejectionReason: RejectionReason = 'UNKNOWN',
  ) {
    // Delete all event data
    dispatch(clearAllEvents())
    // Delete all the module cache
    dispatch(clearAllModules())
    // Delete the experiment cache
    dispatch(clearExperiment())
    // Set variable to show the terminated screen
    if (redirect) {
      dispatch(rejectParticipant(rejectionReason))
    }
  }

  // Function used to show the rejection screen
  function exitExperiment(rejectionReason: RejectionReason = 'UNKNOWN') {
    dispatch(rejectParticipant(rejectionReason))
  }

  // Function used to update the current module
  function updateModuleState(updatedModuleState) {
    dispatch(
      updateModule({
        moduleId: currentModule.moduleId,
        moduleState: {
          ...currentModule.moduleState,
          ...updatedModuleState,
        },
        moduleType: currentModule.moduleType,
      }),
    )
  }

  // Function used to update the global defenition of the experiment
  function updateExperimentState(updatedExperimentState) {
    dispatch(updateExperiment(updatedExperimentState))
  }

  // Only display module if US is loaded
  const showView = usRef !== undefined

  // Return the current module
  return (
    showView && (
      <ModuleComponent
        key={`module-screen-${currentModule.moduleId}`}
        module={currentModule.moduleState}
        updateModule={updateModuleState}
        experiment={experiment}
        updateExperiment={updateExperimentState}
        onModuleComplete={onModuleComplete}
        terminateExperiment={terminateExperiment}
        unconditionalStimulus={usRef}
        exitExperiment={exitExperiment}
      />
    )
  )
}
