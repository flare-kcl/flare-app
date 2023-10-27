import { useEffect, useState } from 'react'
import { StatusBar, View, LogBox } from 'react-native'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import * as Sentry from '@sentry/react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { useFonts } from 'expo-font'

import AssetCache from '@utils/AssetCache'
import AppStateMonitor from '@utils/AppStateMonitor'
import Config from '@utils/Config'
import { FlareThemeProvider, palette } from '@utils/theme'
import { store, peristor } from '@redux/store'
import { onStateHydrated } from '@redux/persist'
import { ExperimentContainer } from 'containers/ExperimentContainer'
import { AlertProvider } from '@utils/AlertProvider'
import { registerNotifications } from '@utils/notifications'

// Link with Sentry
Sentry.init({
  dsn: Config.SENTRY_DTN,
  enableAutoSessionTracking: true,
})

// Activate Notifications
registerNotifications()

// Base container for all screens
export default function App() {
  const [fontsLoaded] = useFonts({
    'Inter-Black': require('./assets/fonts/Inter/Inter-Black.ttf'),
    'Inter-Bold': require('./assets/fonts/Inter/Inter-Bold.ttf'),
    'Inter-ExtraBold': require('./assets/fonts/Inter/Inter-ExtraBold.ttf'),
    'Inter-ExtraLight': require('./assets/fonts/Inter/Inter-ExtraLight.ttf'),
    'Inter-Light': require('./assets/fonts/Inter/Inter-Light.ttf'),
    'Inter-Medium': require('./assets/fonts/Inter/Inter-Medium.ttf'),
    'Inter-Regular': require('./assets/fonts/Inter/Inter-Regular.ttf'),
    'Inter-SemiBold': require('./assets/fonts/Inter/Inter-SemiBold.ttf'),
    'Inter-Thin': require('./assets/fonts/Inter/Inter-Thin.ttf'),
    'Inter': require('./assets/fonts/Inter/Inter-Regular.ttf'),
  })

  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    // Start AppState listening...
    onStateHydrated().then(() => {
      AppStateMonitor.startMonitoring()
    })

    // Show screens when cache loaded
    AssetCache.construct().then(() => setLoaded(true))
  })

  if (!fontsLoaded) {
    return null
  }

  return (
    loaded && (
      <View style={{ flex: 1, backgroundColor: palette.greenLight }}>
        <FlareThemeProvider>
          <SafeAreaProvider>
            <StatusBar barStyle="dark-content" />
            <Provider store={store}>
              <PersistGate persistor={peristor}>
                <AlertProvider />
                <ExperimentContainer />
              </PersistGate>
            </Provider>
          </SafeAreaProvider>
        </FlareThemeProvider>
      </View>
    )
  )
}

// We don't need to worry about this becase we manually handle rehydaration!
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
])
