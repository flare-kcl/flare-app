import { useEffect } from 'react'
import { ModuleScreen } from '@screens'
import { Box } from '@components'
import { ExperimentViewController } from '@controllers'
import { navigatorReadyRef } from '@utils/navigation'
import { LoginScreen } from './LoginScreen'

export const LoadingScreen = ({ navigation }) => {
  if (navigatorReadyRef.current == true) {
    // Try to recover from an experiment
    const existingExperiment = ExperimentViewController.recoverExperiment()
    if (existingExperiment) {
      existingExperiment.present()
    } else {
      // If no existing experiment then show the login
      ExperimentViewController.presentLogin()
    }
  } else {
    navigation.navigate(LoadingScreen.screenID, {})
  }

  return <Box flex={1} flexGrow={1} backgroundColor="greenPrimary" />
}

// Set the screen ID
LoadingScreen.screenID = 'loading'
