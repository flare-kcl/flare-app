import { useEffect, useState, useRef } from 'react'
import { StatusBar, LogBox, Alert } from 'react-native'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import Config from 'react-native-config'
import * as Sentry from '@sentry/react-native'
import AudioSensor from '@utils/AudioSensor'

import {
  DebugIndex,
  TestCacheScreen,
  LoginScreen,
  TermsScreen,
  CriteriaScreen,
  RejectionScreen,
  renderModuleScreen,
  LoadingScreen,
  FearConditioningTrialScreen,
} from '@screens'
import AssetCache from '@utils/AssetCache'
import AppStateMonitor from '@utils/AppStateMonitor'
import { FlareThemeProvider } from '@utils/theme'
import { navigationRef, navigatorReadyRef } from '@utils/navigation'
import { store, peristor } from '@redux/store'
import { onStateHydrated } from '@redux/persist'

// Create a stack navigator
const Stack = createStackNavigator()

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
            <NavigationContainer
              ref={navigationRef}
              onReady={() => {
                navigatorReadyRef.current = true
              }}
            >
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

                {/* WARNING - Loading must stay at the top! */}
                <Stack.Screen
                  name={LoadingScreen.screenID}
                  component={LoadingScreen}
                  options={hiddenHeaderProps}
                />

                <Stack.Screen
                  {...renderModuleScreen(
                    FearConditioningTrialScreen,
                    'Trial',
                    hiddenHeaderProps,
                  )}
                />

                <Stack.Screen
                  {...renderModuleScreen(
                    LoginScreen,
                    'Login',
                    hiddenHeaderProps,
                  )}
                />

                <Stack.Screen
                  {...renderModuleScreen(CriteriaScreen, 'Experiment Consent')}
                />
                <Stack.Screen
                  {...renderModuleScreen(
                    RejectionScreen,
                    'Rejection',
                    hiddenHeaderProps,
                  )}
                />

                <Stack.Screen
                  {...renderModuleScreen(TermsScreen, 'Terms & Conditions')}
                />
              </Stack.Navigator>
            </NavigationContainer>
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
