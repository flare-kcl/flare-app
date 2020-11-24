import { Alert, AppState as NativeAppState } from 'react-native'

import { store } from '@redux/store'
import {
  RNAppState,
  RNAppStateType,
  updateRNAppState,
  recordEvent,
} from '@redux/reducers'

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

  private static onStateChange(nextStateType: RNAppStateType) {
    const currentTime = Date.now()
    const previousState = AppStateMonitor.getLatestState()

    // If we left app and came back
    if (
      (previousState.type === RNAppStateType.Background ||
        previousState.type === RNAppStateType.Inactive) &&
      nextStateType == RNAppStateType.Active
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
  private static getLatestState(): RNAppState {
    // Get the current redux state
    const state = store.getState()

    // Get the previous recorded 'AppState'
    return state.appState
  }
}
