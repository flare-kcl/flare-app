import { useRef, useState } from 'react'
import { Dimensions, ScrollView } from 'react-native'
import { useDispatch } from 'react-redux'
import Spinner from 'react-native-spinkit'
import Config from 'react-native-config'
import camelcaseKeys from 'camelcase-keys'
import Constants from 'expo-constants'

import { Experiment } from '@containers/ExperimentContainer'
import { Box, Text, Button, Image, TextField, SafeAreaView } from '@components'
import { palette } from '@utils/theme'
import { exampleExperimentData } from '@utils/exampleExperiment'
import { updateExperiment, updateModule } from '@redux/reducers'
import { useAlert } from '@utils/AlertProvider'

const dimensions = Dimensions.get('screen')
enum Stages {
  Welcome = 0,
  Login = 1,
  Loading = 2,
}

export const LoginScreen = () => {
  const Alert = useAlert()
  const dispatch = useDispatch()
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
        return demoLogin(dispatch)
      }

      // Attempt Login & reset UI state if fails
      loginWithID(value, dispatch).catch((err) => {
        setScrollStage(Stages.Login)
        Alert.alert('Something Happened...', err)
      })
    }
  }

  return (
    <SafeAreaView flex={1} backgroundColor="greenPrimary">
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
        <Box position="absolute" top={5}>
          <Text>
            Version: {Constants.nativeAppVersion} (
            {Constants.nativeBuildVersion})
          </Text>
        </Box>

        <Text variant="loginHeading" pt={16} pb={2}>
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
                width: '60%',
                height: '65%',
                marginTop: 40,
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
                autoCapitalize="none"
                autoCorrect={false}
                autoCompleteType="username"
                placeholder="Example: ANIXETY-jBSkjbckjb"
                onChangeText={(text) => onChangeText(text)}
                onSubmitEditing={() => setScrollStage(stage + 1)}
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
        <Box flex={1} justifyContent="flex-end" pb={6} px={6}>
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
    </SafeAreaView>
  )
}

// Login Logic
async function loginWithID(participantID: string, dispatch) {
  try {
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

    // Parse experiment modules
    let modules = experimentApiData.modules.map(({ id, type, config }) => ({
      id,
      moduleType: type,
      definition: camelcaseKeys(config, { deep: true }),
    }))

    // Add T&C's module dymanically if config exists
    if (experimentApiData.config) {
      modules = [
        {
          id: 'TermsModule',
          moduleType: 'TERMS',
          definition: {
            terms: experimentApiData.config.terms_and_conditions,
          },
        },
      ].concat(modules)
    }

    // Covert API data to experiment type
    const experiment: Experiment = {
      id: experimentApiData.experiment.id,
      name: experimentApiData.experiment.name,
      description: experimentApiData.experiment.description,
      ratingScaleAnchorLabelLeft:
        experimentApiData.experiment.rating_scale_anchor_label_left,
      ratingScaleAnchorLabelRight:
        experimentApiData.experiment.rating_scale_anchor_label_right,
      ratingScaleAnchorLabelCenter:
        experimentApiData.experiment.rating_scale_anchor_label_center,
      trialLength: experimentApiData.experiment.trial_length * 1000,
      ratingDelay: experimentApiData.experiment.rating_delay * 1000,
      modules,
      intervalTimeBounds: {
        min: experimentApiData.experiment.iti_min_delay,
        max: experimentApiData.experiment.iti_max_delay,
      },
    }

    // Save modules to redux
    experiment.modules.map((mod) => {
      dispatch(
        updateModule({
          moduleId: mod.id,
          moduleType: mod.moduleType,
          moduleState: mod.definition,
          moduleCompleted: false,
          moduleSynced: false,
        }),
      )
    })

    // Save experiment to redux
    dispatch(
      updateExperiment({
        participantID,
        definition: experiment,
        currentModuleIndex: 0,
        isComplete: false,
      }),
    )
  } catch (err) {
    return Promise.reject(
      'This participant identifier is not correct, please try again.',
    )
  }
}

// Demo Mode Activation
function demoLogin(dispatch) {
  // Save modules to redux
  exampleExperimentData.modules.map((mod) => {
    dispatch(
      updateModule({
        moduleId: mod.id,
        moduleType: mod.moduleType,
        moduleState: mod.definition,
        moduleCompleted: false,
        moduleSynced: false,
      }),
    )
  })

  // Save experiment to redux
  dispatch(
    updateExperiment({
      definition: exampleExperimentData,
      currentModuleIndex: 0,
      offlineOnly: true,
      isComplete: false,
      contactEmail: exampleExperimentData.contactEmail,
    }),
  )
}
