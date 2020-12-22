import 'react-native-gesture-handler'
import 'react-native-url-polyfill/auto'
import { registerRootComponent } from 'expo'
import { enableScreens } from 'react-native-screens'

import App from './src/App'

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in the Expo client or in a native build,
// the environment is set up appropriately
enableScreens()
registerRootComponent(App)
