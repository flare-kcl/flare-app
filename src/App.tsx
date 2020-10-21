import { Provider } from 'react-redux'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import store from '@redux/store'
import { HomeScreen } from '@screens'
import { FlareThemeProvider } from '@utils/theme'

// Create a stack navigator
const Stack = createStackNavigator()

export default function App() {
  return (
    <FlareThemeProvider>
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="Home" component={HomeScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    </FlareThemeProvider>
  )
}
