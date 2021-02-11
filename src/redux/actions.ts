import {
  ExperimentCache,
  ExperimentModuleCache,
  updateModule,
} from './reducers'
import { AppState } from './store'
import { currentModuleSelector } from './selectors'
import { FearConditioningModuleState } from '@containers/FearConditioningContainer'
import { PortalAPI } from '@utils/PortalAPI'
import { BasicInfoContainerState } from '@containers/BasicInfoContainer'
import { CriteriaModuleState } from '@containers/CriterionContainer'
import { TermsModuleState } from '@containers/TermsContainer'
import { AffectiveRatingModuleState } from '@containers/AffectiveRatingContainer'
import { InstructionsModuleState } from '@containers/InstructionsContainer'
import { ContingencyAwarenessModuleState } from '@containers/ContingencyAwarenessContainer'
import { USUnpleasantnessModuleState } from '@containers/USUnpleasantnessContainer'
import {
  PostExperimentAnswers,
  PostExperimentQuestionsState,
} from '@containers/PostExperimentQuestionsContainer'

export const syncExperiment = async (dispatch, getState: () => AppState) => {
  // Get Latest State
  const state = getState()
  const experiment = state.experiment
  const modules: ExperimentModuleCache[] = Object.values(state.modules).filter(
    (mod: ExperimentModuleCache) => mod.moduleCompleted && !mod.moduleSynced,
  )

  // Send tracking data
  syncExperimentProgress(dispatch, getState)

  // Finish early if experiment is offline-only
  if (experiment.offlineOnly) return

  // If we have submitted all the modules thens let's flag the experiment as finished
  if (modules.length == 0) await syncExperimentEnd(experiment)

  // Get all modules that have been completed but not synced.
  for (const mod of modules) {
    // Call the specific syncing method and then update the module
    const onModuleSync = () =>
      dispatch(
        updateModule({
          ...mod,
          moduleSynced: true,
        }),
      )

    switch (mod.moduleType) {
      case 'FEAR_CONDITIONING':
        await syncFearConditioningModule(experiment, mod, onModuleSync)
        break

      case 'BASIC_INFO':
        await syncBasicInfoModule(experiment, mod, onModuleSync)
        break

      case 'CRITERION':
        await syncCriterionModule(experiment, mod, onModuleSync)
        break

      case 'TERMS':
        await syncTermsModule(experiment, mod, onModuleSync)
        break

      case 'AFFECTIVE_RATING':
        await syncAffectiveRatingModule(experiment, mod, onModuleSync)
        break

      case 'INSTRUCTIONS':
        await syncInstructionsModule(experiment, mod, onModuleSync)
        break

      case 'US_UNPLEASANTNESS':
        await syncUSUnpleasantnessModule(experiment, mod, onModuleSync)
        break

      case 'CONTINGENCY_AWARENESS':
        await syncContingencyAwarenessModule(experiment, mod, onModuleSync)
        break

      case 'POST_EXPERIMENT_QUESTIONS':
        await syncPostExperimentQuestions(experiment, mod, onModuleSync)
        break

      default:
        onModuleSync()
    }
  }
}

export const syncExperimentProgress = async (
  dispatch,
  getState: () => AppState,
) => {
  // Get the current module
  const state = getState()
  const experiment = state.experiment
  const mod = currentModuleSelector(state)

  PortalAPI.submitProgress({
    module: experiment.rejectionReason == undefined ? mod.moduleId : undefined,
    participant: experiment.participantID,
    rejection_reason: experiment.rejectionReason,
    trial_index:
      mod.moduleType === 'FEAR_CONDITIONING'
        ? mod.moduleState.trials.filter((trial) => trial.response !== undefined)
            .length + 1
        : undefined,
  })
}

type ModuleSyncCallback = () => void

const syncFearConditioningModule = async (
  experiment: ExperimentCache,
  mod: ExperimentModuleCache<FearConditioningModuleState>,
  onModuleSync: ModuleSyncCallback,
) => {
  // Perform POST request for each recordered trial
  try {
    await Promise.all(
      mod.moduleState.trials.map(async (trial, index) => {
        // Don't attempt sync if no response
        if (trial.response === undefined) return

        // Submit data to portal
        await PortalAPI.submitTrialRating({
          trial: index + 1,
          module: mod.moduleId,
          participant: experiment.participantID,
          rating: trial.response?.rating,
          conditional_stimulus: trial.label,
          unconditional_stimulus: trial.reinforced,
          trial_started_at: new Date(trial.response?.startTime).toISOString(),
          response_recorded_at:
            trial.response?.decisionTime &&
            new Date(trial.response?.decisionTime).toISOString(),
          volume_level: trial.response?.volume.toFixed(2),
          calibrated_volume_level: experiment.volume.toFixed(2),
          headphones: trial.response?.headphonesConnected,
        })
      }),
    )

    // If synced all trials then mark module synec
    onModuleSync()
  } catch (err) {
    console.error('Could not sync all trials', err)
  }
}

const syncCriterionModule = async (
  experiment: ExperimentCache,
  mod: ExperimentModuleCache<CriteriaModuleState>,
  onModuleSync: ModuleSyncCallback,
) => {
  // Perform POST request for each recordered question
  try {
    await Promise.all(
      mod.moduleState.questions.map(async (question, index) => {
        await PortalAPI.submitCriterionAnswer({
          module: mod.moduleId,
          participant: experiment.participantID,
          question: question.id,
          // If value is undefined then submit null
          answer: question.value ?? null,
        })
      }),
    )

    // If synced all trials then mark module synec
    onModuleSync()
  } catch (err) {
    console.error('Could not sync all criterions', err)
  }
}

const syncBasicInfoModule = async (
  experiment: ExperimentCache,
  mod: ExperimentModuleCache<BasicInfoContainerState>,
  onModuleSync: ModuleSyncCallback,
) => {
  try {
    // Submit data to portal
    await PortalAPI.submitBasicInfo({
      participant: experiment.participantID,
      module: mod.moduleId,
      date_of_birth: mod.moduleState.dob,
      gender: mod.moduleState.gender ?? '',
      headphone_type: mod.moduleState.headphoneType,
      device_make: mod.moduleState.manufacturer,
      device_model: mod.moduleState.model,
      os_name: mod.moduleState.operatingSystem,
      os_version: mod.moduleState.version,
      /*
       TODO: The following three fields will be done as a seperate peice
       of work as they are not MVP.
      */
      headphone_make: '',
      headphone_model: '',
      headphone_label: '',
    })

    // Mark module as synced
    onModuleSync()
  } catch (err) {
    console.error(err)
  }
}

const syncTermsModule = async (
  experiment: ExperimentCache,
  mod: ExperimentModuleCache<TermsModuleState>,
  onModuleSync: ModuleSyncCallback,
) => {
  try {
    await PortalAPI.submitTermsAgree(experiment.participantID)
    onModuleSync()
  } catch (err) {
    console.error(err)
  }
}

const syncAffectiveRatingModule = async (
  experiment: ExperimentCache,
  mod: ExperimentModuleCache<AffectiveRatingModuleState>,
  onModuleSync: ModuleSyncCallback,
) => {
  try {
    await Promise.all(
      mod.moduleState.stimuli.map((stimuli) => {
        return PortalAPI.submitAffectiveRating({
          participant: experiment.participantID,
          module: mod.moduleId,
          rating: stimuli.rating,
          stimulus: stimuli.label,
        })
      }),
    )

    onModuleSync()
  } catch (err) {
    console.error(err)
  }
}

const syncInstructionsModule = async (
  experiment: ExperimentCache,
  mod: ExperimentModuleCache<InstructionsModuleState>,
  onModuleSync: ModuleSyncCallback,
) => {
  try {
    await PortalAPI.submitCalibratedVolume({
      participant: experiment.participantID,
      module: mod.moduleId,
      rating: mod.moduleState.volumeRating,
      calibrated_volume_level: experiment.volume,
    })

    onModuleSync()
  } catch (err) {
    console.error(err)
  }
}

const syncContingencyAwarenessModule = async (
  experiment: ExperimentCache,
  mod: ExperimentModuleCache<ContingencyAwarenessModuleState>,
  onModuleSync: ModuleSyncCallback,
) => {
  try {
    await PortalAPI.submitContingencyAwareness({
      participant: experiment.participantID,
      module: mod.moduleId,
      awareness_answer: mod.moduleState.awarenessAnswer,
      confirmation_answer: mod.moduleState.confirmationAnswer,
      is_aware: mod.moduleState.isAware,
    })

    onModuleSync()
  } catch (err) {
    console.error(err)
  }
}

const syncUSUnpleasantnessModule = async (
  experiment: ExperimentCache,
  mod: ExperimentModuleCache<USUnpleasantnessModuleState>,
  onModuleSync: ModuleSyncCallback,
) => {
  try {
    await PortalAPI.submitUSUnpleasantness({
      participant: experiment.participantID,
      module: mod.moduleId,
      rating: mod.moduleState.rating,
    })

    onModuleSync()
  } catch (err) {
    console.error(err)
  }
}

const syncPostExperimentQuestions = async (
  experiment: ExperimentCache,
  mod: ExperimentModuleCache<PostExperimentQuestionsState>,
  onModuleSync: ModuleSyncCallback,
) => {
  try {
    const answers: PostExperimentAnswers = mod.moduleState.answers
    await PortalAPI.submitPostExperimentQuestions({
      participant: experiment.participantID,
      module: mod.moduleId,
      experiment_unpleasant_rating: answers.experimentUnpleasantRating,
      did_follow_instructions: answers.didFollowInstructions,
      did_remove_headphones: answers.didRemoveHeadphones,
      headphones_removal_reason: answers.headphonesRemovalReason,
      did_pay_attention: answers.didPayAttention,
      task_environment: answers.taskEnvironment,
      was_alone: answers.wasAlone,
      was_interrupted: answers.wasInterrupted,
    })

    onModuleSync()
  } catch (err) {
    console.error(err)
  }
}

const syncExperimentEnd = async (experiment: ExperimentCache) => {
  try {
    await PortalAPI.submitExperimentEnd(experiment.participantID)
  } catch (err) {
    console.error(err)
  }
}
