import { useRef, useState } from 'react'
import { Dimensions, ScrollView } from 'react-native'
import Spinner from 'react-native-spinkit'

import { ModuleScreen } from '@screens'
import { Box, Text, Button, Image, TextField } from '@components'
import { ExperimentViewController } from '@controllers'
import { exampleExperimentData } from '@utils/exampleExperiment'
import { palette } from '@utils/theme'

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
  const nextStage = () => {
    let nextStage = stage + 1
    setStage(nextStage)
    // Update scorller
    loginScroll.current?.scrollTo({
      x: nextStage * dimensions.width,
      y: 0,
      animated: true,
    })

    // If at loading stage then show experiment
    // TODO: Remove when implmenting login code...
    if (nextStage == Stages.Loading) {
      const exampleExperiment = new ExperimentViewController(
        exampleExperimentData,
      )
      exampleExperiment.present()
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
            Please enter your Participant ID into the form above. You should of
            recieved this in your experiment briefing.
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
            onPress={() => nextStage()}
          />
        )}
      </Box>
    </Box>
  )
}

// Set the screen ID
LoginScreen.screenID = 'login'
