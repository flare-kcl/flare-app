import { useRef, useState } from 'react'
import { Alert, Dimensions, ScrollView } from 'react-native'
import Spinner from 'react-native-spinkit'
import Config from 'react-native-config'
import camelcaseKeys from 'camelcase-keys'

import { ModuleScreen } from '@screens'
import { Box, Text, Button, Image, TextField } from '@components'
import { ExperimentViewController, Experiment } from '@controllers'
import { palette } from '@utils/theme'
import {
  exampleExperimentData,
  exampleTermsDefinition,
} from '@utils/exampleExperiment'

const dimensions = Dimensions.get('screen')
enum Stages {
  Welcome = 0,
  Login = 1,
  Loading = 2,
}

export const LoginScreen: ModuleScreen = () => {
  const loginScroll = useRef(null)
  const [stage, setStage] = useState(0)
  const [value, onChangeText] = useState('')

  // Don't let user continue until they enter correct value
  const buttonDisabled = stage == Stages.Login && value == ''

  // Increment through each stage
  const setScrollStage = (nextStage: Stages) => {
    // Updare internal state
    setStage(nextStage)

    // Update scorller
    loginScroll.current?.scrollTo({
      x: nextStage * dimensions.width,
      y: 0,
      animated: true,
    })

    // If at loading stage then attempt login
    if (nextStage == Stages.Loading) {
      // Check if user is using demo login
      if (value == 'local.demo') {
        return demoLogin()
      }

      // Attempt Login & reset UI state if fails
      loginWithID(value).catch((err) => {
        setScrollStage(Stages.Login)
        Alert.alert('Something Happened...', err)
      })
    }
  }

  return (
    <Box
      flex={1}
      flexGrow={1}
      height={dimensions.height}
      flexDirection={{
        phone: 'column',
      }}
      alignItems="center"
      justifyContent="flex-start"
      backgroundColor="greenPrimary"
    >
      <Text variant="heading" pt={24} pb={2}>
        FLARe
      </Text>

      <Text variant="caption" pb={4} textAlign="center" px={6}>
        Fear Learning and Anxiety Response
      </Text>

      {/* Animate transition from image to login form to loading screen */}
      <ScrollView
        ref={loginScroll}
        pagingEnabled
        horizontal
        scrollEnabled={false}
        decelerationRate="fast"
        contentContainerStyle={{ width: `300%`, flex: 0 }}
        showsHorizontalScrollIndicator={false}
        style={{ maxHeight: '50%' }}
      >
        {/* Placeholder Image Block */}
        <Box
          width={dimensions.width}
          alignItems="center"
          justifyContent="flex-start"
          pt={6}
        >
          <Image
            style={{
              width: '70%',
              height: '65%',
            }}
            resizeMode="contain"
            opacity={0.8}
            source={require('../assets/images/fireworks.png')}
          />
        </Box>

        {/* Login Form Block */}
        <Box
          width={dimensions.width}
          alignItems="center"
          justifyContent="flex-start"
          pt={10}
        >
          <Box width="100%" px={4}>
            <Text fontWeight="bold" color="darkGrey" pb={2}>
              Participant ID
            </Text>
            <TextField
              variant="login"
              placeholder="Example: ANIXETY-jBSkjbckjb"
              onChangeText={(text) => onChangeText(text)}
              value={value}
            />
          </Box>

          <Text variant="caption2" textAlign="center" pt={10} px={3}>
            Please enter your Participant ID into the form above. You should
            have recieved this in your experiment briefing.
          </Text>
        </Box>

        {/* Spinner that stays on screen until experiment is loaded */}
        <Box
          width={dimensions.width}
          alignItems="center"
          justifyContent="center"
          alignContent="center"
          pt={10}
        >
          <Spinner
            isVisible
            size={100}
            type="WanderingCubes"
            color={palette.purple}
          />
          <Text variant="caption2" pt={14}>
            Downloading Experiment...
          </Text>
        </Box>
      </ScrollView>

      {/* Push button to bottom of screen */}
      <Box flex={1} justifyContent="flex-end" pb={14} px={4}>
        {stage != Stages.Loading && (
          <Button
            variant="primary"
            label={stage == Stages.Login ? 'Login' : 'Start Experiment'}
            opacity={buttonDisabled ? 0.6 : 1}
            disabled={buttonDisabled}
            onPress={() => setScrollStage(stage + 1)}
          />
        )}
      </Box>
    </Box>
  )
}

// Set the screen ID
LoginScreen.screenID = 'login'

// Login Logic
async function loginWithID(participantID: string) {
  try {
    console.log(Config.BASE_API_URL)
    // Create login request and get the corresponding experiment object
    const experimentRawData = await fetch(
      `${Config.BASE_API_URL}/configuration/`,
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': Config.API_AUTH_TOKEN,
        },
        body: JSON.stringify({ participant: participantID }),
      },
    )

    // Parse the experiment data to typed structure
    const experimentApiData = await experimentRawData.json()

    // Covert API data to experiment type
    const experiment: Experiment = {
      id: experimentApiData.experiment.id,
      name: experimentApiData.experiment.name,
      trialLength: experimentApiData.experiment.trial_length * 1000,
      ratingDelay: experimentApiData.experiment.rating_delay * 1000,
      modules: experimentApiData.modules.map(({ id, type, config }) => ({
        id,
        moduleType: type,
        definition: camelcaseKeys(config),
        moduleCompleted: false,
      })),
      // TODO: Hardcoded as backend doesn't support yet...
      description: '',
      intervalTimeBounds: {
        min: 500,
        max: 1500,
      },
    }

    // Creare a experiment view controller
    const experimentVC = new ExperimentViewController(experiment)

    // Cache the experiment
    experimentVC.saveExperiment()

    // Present the experiment
    experimentVC.present()
  } catch (err) {
    return Promise.reject(
      'This participant identifier is not correct, please try again.',
    )
  }
}

// Demo Mode Activation
function demoLogin() {
  const exampleExperiment = new ExperimentViewController(exampleExperimentData)
  exampleExperiment.present()
}
