import { useEffect, useState, useRef } from 'react'
import { StatusBar, LogBox, Alert } from 'react-native'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import Config from 'react-native-config'
import * as Sentry from '@sentry/react-native'
import AudioSensor from '@utils/AudioSensor'

import AssetCache from '@utils/AssetCache'
import AppStateMonitor from '@utils/AppStateMonitor'
import { FlareThemeProvider } from '@utils/theme'
import { store, peristor } from '@redux/store'
import { onStateHydrated } from '@redux/persist'
import { ExperimentContainer } from 'containers/ExperimentContainer'

// Link with Sentry
Sentry.init({
  dsn: Config.SENTRY_DTN,
})

// Base container for all screens
export default function App() {
  const [loaded, setLoaded] = useState(false)
  const volumeAlertShown = useRef(false)

  const notifyUserRegardingHeadphones = (connected: boolean) => {
    if (connected === false) {
      Alert.alert(
        'Headphones Required',
        'Please connect headphones to continue with the experiment',
        [
          {
            text: 'Dismiss',
            onPress: async () => {
              notifyUserRegardingHeadphones(
                await AudioSensor.isHeadphonesConnected(),
              )
            },
          },
        ],
        { cancelable: false },
      )
    }
  }

  const notifyUserRegardingVolume = (volume: number) => {
    if (volume < 1 && volumeAlertShown.current == false) {
      volumeAlertShown.current = true
      Alert.alert(
        'Max Volume Required',
        'Please set your volume at 100%',
        [
          {
            text: 'Dismiss',
            onPress: async () => {
              volumeAlertShown.current = false
              notifyUserRegardingVolume(await AudioSensor.getCurrentVolume())
            },
          },
        ],
        { cancelable: false },
      )
    }
  }

  useEffect(() => {
    // TODO: Ensure user has headphones connected - Will be moved to future module
    AudioSensor.isHeadphonesConnected().then(notifyUserRegardingHeadphones)
    AudioSensor.addHeadphonesListener(notifyUserRegardingHeadphones)

    // TODO: Ensure user has max volume set - Will be moved to future module
    AudioSensor.getCurrentVolume().then(notifyUserRegardingVolume)
    AudioSensor.addVolumeListener(notifyUserRegardingVolume)

    // Start AppState listening...
    onStateHydrated().then(() => {
      AppStateMonitor.startMonitoring()
    })

    // Show screens when cache loaded
    AssetCache.construct().then(() => setLoaded(true))
  })

  const hiddenHeaderProps = {
    headerShown: false,
  }

  return (
    loaded && (
      <FlareThemeProvider>
        <StatusBar barStyle="dark-content" />
        <Provider store={store}>
          <PersistGate persistor={peristor}>
            <ExperimentContainer />
          </PersistGate>
        </Provider>
      </FlareThemeProvider>
    )
  )
}

// We don't need to worry about this becase we manually handle rehydaration!
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
])
