import { AppState as NativeAppState } from 'react-native'

import { store } from '@redux/store'
import {
  RNAppState,
  RNAppStateType,
  updateRNAppState,
  recordEvent,
  rejectParticipant,
} from '@redux/reducers'
import { isPast } from 'date-fns'
import { currentModuleSelector, experimentSelector } from '@redux/selectors'

const SUSPENDED_TIMEOUT = 60000
const STRICT_SUSPENED_TIMEOUT = 30000

export default class AppStateMonitor {
  /**
   * Monitor any changes in App Cache and create any necessary events
   *
   * @param url The remote url that has been cached locally.
   */
  static async startMonitoring() {
    // Listen to any app state changes...
    NativeAppState.addEventListener('change', AppStateMonitor.onStateChange)

    // Trigger update on start
    AppStateMonitor.onStateChange(NativeAppState.currentState as RNAppStateType)
  }

  static manualUpdate() {
    // Manually trigger update
    AppStateMonitor.onStateChange(NativeAppState.currentState as RNAppStateType)
  }

  private static onStateChange(nextStateType: RNAppStateType) {
    const currentTime = Date.now()
    const previousState = AppStateMonitor.getLatestState()

    // If we left app and came back
    if (
      (previousState.type === 'background' ||
        previousState.type === 'inactive') &&
      nextStateType == 'active'
    ) {
      // Calculate suspened time in seconds
      const suspendedTime = currentTime - previousState.lastUpdated

      // Record an event detailing how long the app was suspended
      store.dispatch(
        recordEvent({
          eventType: 'SuspensionPeriod',
          recorded: currentTime,
          value: String(suspendedTime),
        }),
      )

      // Determine timeout mode
      const experiment = experimentSelector(store.getState())
      const currentModule = currentModuleSelector(store.getState())
      const applyStrictTimeout =
        currentModule?.moduleType === 'FEAR_CONDITIONING'

      // Trigger flag if the user had the app suspended for too long.
      const breakExpired = experiment.breakEndDate === undefined
      const timeoutTriggered =
        !experiment.isComplete &&
        (suspendedTime > SUSPENDED_TIMEOUT ||
          (applyStrictTimeout && suspendedTime > STRICT_SUSPENED_TIMEOUT))

      // Timeout casued rejection has been removed for now...
      // if (timeoutTriggered && breakExpired) {
      //   store.dispatch(
      //     rejectParticipant(applyStrictTimeout ? 'TRIAL_TIMEOUT' : 'TIMEOUT'),
      //   )
      // }
    }

    // Update internal recording of 'AppState'
    store.dispatch(
      updateRNAppState({
        type: nextStateType,
        lastUpdated: Date.now(),
      }),
    )
  }

  /**
   * Return the latest recorded 'AppState', Which defines if the app is in the foreground or background.
   */
  static getLatestState(): RNAppState {
    // Get the current redux state
    const state = store.getState()

    // Get the previous recorded 'AppState'
    return state.appState
  }
}
