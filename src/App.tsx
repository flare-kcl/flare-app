import { useEffect, useState } from 'react'
import { Provider } from 'react-redux'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import store from '@redux/store'
import { TestCacheScreen, LoginScreen } from '@screens'
import AssetCache from '@utils/AssetCache'
import { FlareThemeProvider } from '@utils/theme'

// Create a stack navigator
const Stack = createStackNavigator()

export default function App() {
  const sceneProps = {
    options: { headerShown: false },
  }

  return (
    <FlareThemeProvider>
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator>
            {/* Dedicated Testing Screens - Not shown to the participant */}
            <Stack.Screen name="Tests.ImageCacheTest" component={TestCacheScreen} />

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
