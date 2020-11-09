import { useEffect, useState } from 'react'
import { StatusBar } from 'react-native'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import Config from 'react-native-config'
import * as Sentry from '@sentry/react-native'

import { FlareThemeProvider, palette } from '@utils/theme'
import { store, peristor } from '@redux/store'
import { onStateHydrated } from '@redux/persist'

import {
  DebugIndex,
  TestCacheScreen,
  LoginScreen,
  TermsScreen,
  CriteriaScreen,
  RejectionScreen,
} from '@screens'
import AssetCache from '@utils/AssetCache'
import AppStateMonitor from '@utils/AppStateMonitor'

// Create a stack navigator
const Stack = createStackNavigator()

// Link with Sentry
Sentry.init({
  dsn: Config.SENTRY_DTN,
})

export default function App() {
  const headerProps = {
    headerTintColor: palette.darkGrey,
    headerTitleStyle: {
      fontSize: 18,
    },
    headerStyle: {
      backgroundColor: palette.greenLight,
    },
  }
  const hiddenHeaderProps = {
    options: { headerShown: false },
  }

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
            <NavigationContainer>
              <Stack.Navigator>
                {/* Dedicated Testing Screens - Not shown to the participant */}
                {Config.SHOW_DEBUG_MENU && (
                  <>
                    <Stack.Screen
                      name="Tests.DebugIndex"
                      component={DebugIndex}
                    />
                    <Stack.Screen
                      name="Tests.TestCacheScreen"
                      component={TestCacheScreen}
                    />
                  </>
                )}

                <Stack.Screen
                  name="Consent"
                  component={CriteriaScreen}
                  options={{
                    headerTitle: 'Experiment Consent',
                    ...headerProps,
                  }}
                />
                <Stack.Screen
                  name="Reject"
                  component={RejectionScreen}
                  {...hiddenHeaderProps}
                />

                <Stack.Screen
                  name="Terms"
                  component={TermsScreen}
                  options={{
                    headerTitle: 'Terms & Conditions',
                    ...headerProps,
                  }}
                />
                <Stack.Screen
                  name="Login"
                  component={LoginScreen}
                  {...hiddenHeaderProps}
                />
              </Stack.Navigator>
            </NavigationContainer>
          </PersistGate>
        </Provider>
      </FlareThemeProvider>
    )
  )
}
