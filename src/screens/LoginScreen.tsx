import { useRef, useState } from 'react'
import { Dimensions, ScrollView } from 'react-native'
import Spinner from 'react-native-spinkit'

import { Box, Text, Button, Image, TextField } from '@components'
import { palette } from '@utils/theme'

const dimensions = Dimensions.get('screen')
enum Stages {
  Welcome = 0,
  Login = 1,
  Loading = 2,
}

export const LoginScreen = () => {
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
      paddingVertical={10}
    >
      <Text variant="heading" paddingTop={8} paddingBottom={2}>
        FLARe
      </Text>

      <Text
        variant="caption"
        paddingBottom={4}
        textAlign="center"
        paddingHorizontal={6}
      >
        Fear Learning and Anxiety Response
      </Text>

      {/* Animate transition from image to login form to loading screen */}
      <ScrollView
        ref={loginScroll}
        pagingEnabled
        horizontal
        scrollEnabled={false}
        decelerationRate="fast"
        contentContainerStyle={{ width: `300%` }}
        showsHorizontalScrollIndicator={false}
      >
        {/* Placeholder Image Block */}
        <Box
          width={dimensions.width}
          alignItems="center"
          justifyContent="flex-start"
        >
          <Image
            width={dimensions.width}
            maxWidth={240}
            height={300}
            resizeMode="contain"
            opacity={0.7}
            source={require('../assets/images/fireworks.png')}
          />
        </Box>

        {/* Login Form Block */}
        <Box
          width={dimensions.width}
          alignItems="center"
          justifyContent="flex-start"
          paddingTop={10}
        >
          <Box>
            <Text fontWeight="bold" color="darkGrey" paddingBottom={2}>
              Participant ID
            </Text>
            <TextField
              variant="login"
              placeholder="Example: ANIXETY-jBSkjbckjb"
              onChangeText={(text) => onChangeText(text)}
              value={value}
            />
          </Box>

          <Text
            variant="caption2"
            textAlign="center"
            paddingTop={10}
            paddingHorizontal={6}
          >
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
          paddingTop={10}
        >
          <Spinner
            isVisible
            size={100}
            type="WanderingCubes"
            color={palette.purple}
          />
          <Text variant="caption2" paddingTop={14}>
            Downloading Experiment...
          </Text>
        </Box>
      </ScrollView>

      {/* Push button to bottom of screen */}
      <Box flex={1} justifyContent="flex-end" paddingBottom={6}>
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
