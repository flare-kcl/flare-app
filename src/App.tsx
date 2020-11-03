import { useEffect, useState } from 'react'
import { StatusBar } from 'react-native'
import { Provider } from 'react-redux'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import Config from 'react-native-config'
import * as Sentry from '@sentry/react-native'

import { FlareThemeProvider, palette } from '@utils/theme'
import store from '@redux/store'
import { DebugIndex, TestCacheScreen, LoginScreen, TermsScreen } from '@screens'
import AssetCache from '@utils/AssetCache'

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

  // Only show UI once Asset Cache is ready
  useEffect(() => {
    AssetCache.construct().then(() => setLoaded(true))
  })

  return (
    loaded && (
      <FlareThemeProvider>
        <Provider store={store}>
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
        </Provider>
      </FlareThemeProvider>
    )
  )
}
