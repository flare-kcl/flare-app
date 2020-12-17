import { ExperimentCache, ExperimentModule, updateModule } from './reducers'
import { AppState } from './store'
import { FearConditioningModuleState } from '@containers/FearConditioningContainer'
import { PortalAPI } from '@utils/PortalAPI'
import { BasicInfoContainerState } from '@containers/BasicInfoContainer'

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

        case 'BASIC_INFO':
          await syncBasicInfoModule(experiment, mod, onModuleSync)
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

        // Submit data to portal
        try {
          await PortalAPI.submitTrialRating({
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

const syncBasicInfoModule = async (
  experiment: ExperimentCache,
  mod: ExperimentModule<BasicInfoContainerState>,
  onModuleSync: ModuleSyncCallback,
) => {
  try {
    // Submit data to portal
    await PortalAPI.submitBasicInfo({
      participant: experiment.participantID,
      module: mod.moduleId,
      date_of_birth: mod.moduleState.dob,
      gender: mod.moduleState.gender,
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
