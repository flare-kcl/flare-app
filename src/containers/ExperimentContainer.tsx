import { useDispatch, useSelector } from 'react-redux'
import { experimentSelector, currentModuleSelector } from '@redux/selectors'
import {
  nextModule,
  updateModule,
  clearAllEvents,
  clearAllModules,
  clearExperiment,
  updateExperiment,
  rejectParticipant,
  ExperimentCache,
} from '@redux/reducers'
import { LoginScreen, RejectionScreen } from '@screens'
import { TermsContainer } from './TermsContainer'
import { CriterionContainer } from './CriterionContainer'
import { FearConditioningContainer } from './FearConditioningContainer'
import { VolumeCalibrationContainer } from './VolumeCalibrationContainer'

const ExperimentModuleTypes = {
  TERMS: TermsContainer,
  CRITERIA: CriterionContainer,
  VOLUME_CALIBRATION: VolumeCalibrationContainer,
  FEAR_CONDITIONING: FearConditioningContainer,
}

type ExperimentModuleConfig = {
  id: string
  moduleType: string
  definition?: Object
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
}

export type ExperimentModule<
  ModuleState = any,
  ExtraProps = any
> = React.FunctionComponent<
  {
    module: ModuleState
    updateModule: (ModuleState) => void
    experiment: ExperimentCache
    onModuleComplete: () => void
    terminateExperiment: () => void
    exitExperiment: () => void
  } & ExtraProps
>

export const ExperimentContainer = () => {
  // Get the experiment object and the index of the current module.
  const dispatch = useDispatch()
  const experiment = useSelector(experimentSelector)
  const currentModule = useSelector(currentModuleSelector)

  // If the user has been 'screened out' then show respective screen
  if (experiment.participantRejected) {
    return <RejectionScreen onExit={() => terminateExperiment(false)} />
  }

  // If no experiment saved then return the login
  if (experiment.definition == undefined) {
    return <LoginScreen />
  }

  // If all modules rendered then go back to login
  if (experiment.currentModuleIndex === experiment.definition.modules.length) {
    terminateExperiment(false)
    return null
  }

  // Get the current module data and it's respective component.
  const ModuleComponent: ExperimentModule =
    ExperimentModuleTypes[currentModule?.moduleType]

  // This function is called when the experiment should transition to next module.
  function onModuleComplete() {
    dispatch(nextModule())
  }

  // Function used to reset experiment state
  function terminateExperiment(redirect = true) {
    // Delete all event data
    dispatch(clearAllEvents())
    // Delete all the module cache
    dispatch(clearAllModules())
    // Delete the experiment cache
    dispatch(clearExperiment())
    // Set variable to show the terminated screen
    if (redirect) {
      dispatch(rejectParticipant())
    }
  }

  // Function used to show the rejection screen
  function exitExperiment() {
    dispatch(rejectParticipant())
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

  // Return the current module
  return (
    <ModuleComponent
      key={`module-screen-${currentModule.moduleId}`}
      module={currentModule.moduleState}
      updateModule={updateModuleState}
      experiment={experiment}
      updateExperiment={updateExperimentState}
      onModuleComplete={onModuleComplete}
      terminateExperiment={terminateExperiment}
      exitExperiment={exitExperiment}
    />
  )
}
