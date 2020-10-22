import { DEBUG } from '@env'
import { useEffect, useState } from 'react'
import { Provider } from 'react-redux'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import store from '@redux/store'
import { DebugIndex, TestCacheScreen, HomeScreen } from '@screens'
import AssetCache from '@utils/AssetCache'
import { FlareThemeProvider } from '@utils/theme'

// Create a stack navigator
const Stack = createStackNavigator()

export default function App() {
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

              {/* Application Screen */}
              <Stack.Screen name="HomeScreen" component={HomeScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </Provider>
      </FlareThemeProvider>
    )
  )
}
