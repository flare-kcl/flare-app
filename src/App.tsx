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
  enableAutoSessionTracking: true,
})

// Base container for all screens
export default function App() {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    // Start AppState listening...
    onStateHydrated().then(() => {
      AppStateMonitor.startMonitoring()
    })

    // Show screens when cache loaded
    AssetCache.construct().then(() => setLoaded(true))
  })

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
