import { useRef, useState } from 'react'
import { Dimensions, ImageSourcePropType, ScrollView } from 'react-native'
import { useDispatch } from 'react-redux'
import Spinner from 'react-native-spinkit'
import camelcaseKeys from 'camelcase-keys'
import Constants from 'expo-constants'
import * as Sentry from '@sentry/react-native'
import { shuffle } from 'lodash'

import { Experiment } from '@containers/ExperimentContainer'
import { Box, Text, Button, Image, TextField, SafeAreaView } from '@components'
import { palette } from '@utils/theme'
import { exampleExperimentData } from '@utils/exampleExperiment'
import { setExperiment, updateModule, clearAllModules } from '@redux/reducers'
import { useAlert } from '@utils/AlertProvider'
import AssetCache from '@utils/AssetCache'
import Config from '@utils/Config'

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
        Alert.alert('An error occurred...', err)
      })
    }
  }

  return (
    <SafeAreaView flex={1} backgroundColor="greenLight">
      <Box
        flex={1}
        flexGrow={1}
        height={dimensions.height}
        flexDirection={'column'}
        alignItems="center"
        justifyContent="flex-start"
        backgroundColor="greenLight"
      >
        <Box position="absolute" top={3}>
          <Text>
            Version: {Constants.nativeAppVersion} (
            {Constants.nativeBuildVersion})
          </Text>
        </Box>

        <Text variant="loginHeading" pt={8} pb={2}>
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
                width: '80%',
                height: '75%',
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
              <Text fontFamily="Inter-SemiBold" color="darkGrey" pb={2}>
                Participant ID
              </Text>
              <TextField
                variant="login"
                autoCapitalize="none"
                autoCorrect={false}
                autoCompleteType="username"
                placeholder="Example: ID.A1B2C3"
                placeholderTextColor={palette.grey}
                onChangeText={(text) => onChangeText(text)}
                onSubmitEditing={() => setScrollStage(stage + 1)}
                value={value}
              />
            </Box>

            <Text variant="caption2" textAlign="center" pt={5} px={3}>
              Please enter your Participant ID into the field above. You should
              have received this in your experiment briefing.
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
    const { BASE_MEDIA_URL, BASE_API_URL } = Config
    const experimentRawData = await fetch(`${BASE_API_URL}/configuration/`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': Config.API_AUTH_TOKEN,
      },
      body: JSON.stringify({ participant: participantID }),
    })

    // Parse the experiment data to typed structure
    const experimentApiData = await experimentRawData.json()

    // Check if Participant ID is incorrect
    if (experimentApiData.participant) {
      return Promise.reject(experimentApiData.participant)
    }

    // Parse experiment modules
    let modules = experimentApiData.modules.map(({ id, type, config }) => ({
      id,
      moduleType: type,
      shouldSyncProgress: true,
      definition: camelcaseKeys(config, { deep: true }),
    }))

    // Add Notifications Permissions Screen
    modules = [
      {
        id: 'NotificationsModule',
        moduleType: 'NOTIFICATIONS',
        definition: {},
      },
    ].concat(modules)

    // Add T&Cs module dymanically if config exists
    if (experimentApiData.config?.terms_and_conditions) {
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

    // Add sync screen
    modules = modules.concat([
      {
        id: 'SummaryModule',
        moduleType: 'SUMMARY',
        definition: {},
      },
    ])

    // Add reimbursement module dymanically if config exists
    if (experimentApiData.experiment?.reimbursements) {
      modules = modules.concat([
        {
          id: 'ReimbursementModule',
          moduleType: 'REIMBURSEMENT',
          definition: {},
        },
      ])
    }

    // Check id user is locked out
    if (experimentApiData.participant_started_at != null) {
      return Promise.reject(
        'This particpant id has already been used, Please contact your research contact.',
      )
    }

    // If incorrect login
    if (experimentRawData.status == 400) {
      if (experimentApiData.participant) {
        return Promise.reject(experimentApiData.participant)
      } else {
        // Record unknown validation issue
        Sentry.captureMessage(JSON.stringify(experimentApiData))
        return Promise.reject('An unknown error occured, Please try again.')
      }
    }

    // Utility function to cache a file and return a format that can loaded.
    const cacheRemoteAsset = async (url: string) => {
      if (url == null) {
        return null
      }

      return {
        uri: await AssetCache.cacheFile((Config.BASE_MEDIA_URL ?? '') + url),
      }
    }

    const cacheVisualStimuli = async (label: string, url: string) => {
      if (url == null) {
        return null
      }

      return {
        label,
        image: await cacheRemoteAsset(url),
      }
    }

    // Shuffle CS and assign to CS+/CS-
    const conditionalStimuli = await shuffle([
      await cacheVisualStimuli('csa', experimentApiData.experiment.csa),
      await cacheVisualStimuli('csb', experimentApiData.experiment.csb),
    ])

    // Covert API data to experiment type
    const experiment: Experiment = {
      id: experimentApiData.experiment.id,
      name: experimentApiData.experiment.name,
      contactEmail:
        experimentApiData.experiment.contact_email &&
        `mailto:${experimentApiData.experiment.contact_email}`,
      reimbursements: experimentApiData.experiment.reimbursements,
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
      minimumVolume: experimentApiData.experiment.minimum_volume,
      usFileVolume: experimentApiData.experiment.us_file_volume,
      intervalTimeBounds: {
        min: experimentApiData.experiment.iti_min_delay,
        max: experimentApiData.experiment.iti_max_delay,
      },
      contextStimuli: {
        A: await cacheRemoteAsset(experimentApiData.experiment.context_a),
        B: await cacheRemoteAsset(experimentApiData.experiment.context_b),
        C: await cacheRemoteAsset(experimentApiData.experiment.context_c),
      },
      unconditionalStimulus: await cacheRemoteAsset(
        experimentApiData.experiment.us,
      ),
      conditionalStimuli: {
        'cs+': conditionalStimuli[0],
        'cs-': conditionalStimuli[1],
      },
      generalisationStimuli: [
        await cacheVisualStimuli('gsa', experimentApiData.experiment.gsa),
        await cacheVisualStimuli('gsb', experimentApiData.experiment.gsb),
        await cacheVisualStimuli('gsc', experimentApiData.experiment.gsc),
        await cacheVisualStimuli('gsd', experimentApiData.experiment.gsd),
      ].filter((cs) => cs != null),
    }

    // Save the experiment object to Sentry
    Sentry.setContext('experiment', experiment)

    // Save modules to redux
    dispatch(clearAllModules())
    experiment.modules.map((mod, index) => {
      dispatch(
        updateModule({
          index,
          moduleId: mod.id,
          moduleType: mod.moduleType,
          moduleState: mod.definition,
          moduleCompleted: false,
          moduleSynced: false,
          shouldSyncProgress: mod.shouldSyncProgress ?? false,
        }),
      )
    })

    // Save experiment to redux
    dispatch(
      setExperiment({
        participantID,
        definition: experiment,
        currentModuleIndex: 0,
        isComplete: false,
        contactEmail: experiment.contactEmail,
        notificationsEnabled: false,
        volume: experiment.usFileVolume,
      }),
    )
  } catch (err) {
    console.error(err)
    Sentry.captureException(err)
    return Promise.reject('An unknown error occured, Please try again.')
  }
}

// Demo Mode Activation
function demoLogin(dispatch) {
  // Save modules to redux
  dispatch(clearAllModules())
  exampleExperimentData.modules.map((mod, index) => {
    dispatch(
      updateModule({
        index,
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
    setExperiment({
      definition: exampleExperimentData,
      currentModuleIndex: 0,
      offlineOnly: true,
      isComplete: false,
      contactEmail: exampleExperimentData.contactEmail,
      notificationsEnabled: false,
    }),
  )
}
