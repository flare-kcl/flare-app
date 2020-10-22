import { DEBUG } from '@env'
import { useEffect, useState } from 'react'
import { Provider } from 'react-redux'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import store from '@redux/store'
import { DebugIndex, TestCacheScreen, LoginScreen } from '@screens'
import AssetCache from '@utils/AssetCache'
import { FlareThemeProvider } from '@utils/theme'

// Create a stack navigator
const Stack = createStackNavigator()

export default function App() {
  const sceneProps = {
    options: { headerShown: false },
  }

  const [loaded, setLoaded] = useState(false)

  // Only show UI once Asset Cache is ready
  useEffect(() => {
    AssetCache.construct().then(() => setLoaded(true))
  })

  return loaded && (
    <FlareThemeProvider>
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator>
            {/* Dedicated Testing Screens - Not shown to the participant */}
            {DEBUG && (
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
              name="Login"
              component={LoginScreen}
              {...sceneProps}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    </FlareThemeProvider>
  )
}
