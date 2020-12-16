import Config from 'react-native-config'
import { ExperimentCache, ExperimentModule, updateModule } from './reducers'
import { AppState } from './store'
import { FearConditioningModuleState } from '@containers/FearConditioningContainer'

export const syncExperiment = async (dispatch, getState: () => AppState) => {
  // Get Latest State
  const state = getState()
  const experiment = state.experiment
  const modules: ExperimentModule[] = Object.values(state.modules)

  // Finish early if experiment is offline-only
  if (experiment.offlineOnly) return

  // Get all modules that have been completed but not synced.
  for (const mod of modules) {
    if (mod.moduleCompleted && !mod.moduleSynced) {
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

        default:
          onModuleSync()
          console.warn(
            `Module type ${mod.moduleType} doesn't support data submission!`,
          )
      }
    }
  }
}

type ModuleSyncCallback = () => void

const syncFearConditioningModule = async (
  experiment: ExperimentCache,
  mod: ExperimentModule<FearConditioningModuleState>,
  onModuleSync: ModuleSyncCallback,
) => {
  // Perform POST request for each recordered trial
  try {
    await Promise.all(
      mod.moduleState.trials.map(async (trial, index) => {
        // Don't attempt sync if no response
        if (trial.response === undefined || trial.response?.skipped) return

        // Create the JSON object that the API expects
        const submissionData = JSON.stringify({
          trial: index + 1,
          module: mod.moduleId,
          participant: experiment.participantID,
          rating: trial.response?.rating,
          conditional_stimulus: trial.label,
          unconditional_stimulus: trial.reinforced,
          trial_started_at: new Date(trial.response?.startTime).toISOString(),
          response_recorded_at: new Date(
            trial.response?.decisionTime,
          ).toISOString(),
          volume_level: trial.response?.volume.toFixed(2),
          calibrated_volume_level: experiment.volume.toFixed(2),
          headphones: trial.response?.headphonesConnected,
        })

        try {
          const response = await fetch(
            `${Config.BASE_API_URL}/fear-conditioning-data/`,
            {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': Config.API_AUTH_TOKEN,
              },
              body: submissionData,
            },
          )

          // If validation error
          if (response.status === 400) {
            console.warn('Trial submission could not be processed.')
          }
        } catch (err) {
          console.error(err)
        }
      }),
    )

    // If synced all trials then mark module synec
    onModuleSync()
  } catch (err) {
    console.error('Could not sync all trials', err)
  }
}
