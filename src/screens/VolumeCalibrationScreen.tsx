import { useCallback, useEffect, useState, useRef } from 'react'
import { Alert } from 'react-native'
import { Audio } from 'expo-av'
import { Entypo } from '@expo/vector-icons'
import { Text, Box, Button, TrialRatingScale } from '@components'
import { palette } from '@utils/theme'

type VolumeCalibrationScreenParams = {
  onFinishCalibration: (volume: number) => void
}

export const VolumeCalibrationScreen: React.FunctionComponent<VolumeCalibrationScreenParams> = ({
  onFinishCalibration,
}) => {
  const volume = useRef(0.5)
  const soundRef = useRef<Audio.Sound>()
  const [stage, setStage] = useState(0)
  const [countdown, setCountdown] = useState(3)
  const [volumeRating, setVolumeRating] = useState(undefined)

  const playStimuli = async () => {
    // Set the volume
    await soundRef.current?.setVolumeAsync(volume.current)
    // Play the sound
    await soundRef.current?.replayAsync()
  }

  useEffect(() => {
    // Assign sound object to ref
    Audio.Sound.createAsync(require('../assets/sounds/ding.wav'), {
      shouldPlay: false,
    }).then(({ sound }) => {
      soundRef.current = sound
    })
  }, [])

  const decreaseCountdown = (countdown: number, callback: () => void) => {
    setTimeout(() => {
      // If timer finished...
      if (countdown == 0) {
        callback()
      } else {
        setCountdown(countdown - 1)
        return decreaseCountdown(countdown - 1, callback)
      }
    }, 1000)
  }

  const startCalibration = async () => {
    // Show countdown timer
    setStage(1)

    // Trigger Countdown
    const testCurrentVolume = () => {
      setCountdown(3)
      decreaseCountdown(countdown, async () => {
        // Play Sound
        await playStimuli()

        // Ask participant what they thought
        Alert.alert(
          'How was that?',
          'Is the volume of the sound uncomfortable?',
          [
            {
              text: 'Yes',
              onPress: () => {
                // Switch to volume rating
                setStage(2)
              },
            },
            {
              text: 'No',
              onPress: () => {
                // If reached max volume
                if (volume.current >= 1.0) {
                  setStage(2)
                } else {
                  // Increase volume and play again
                  volume.current = +(volume.current + 0.1).toFixed(2)
                  testCurrentVolume()
                }
              },
            },
            {
              text: 'Not Sure',
              onPress: () => {
                // Restart countdown
                testCurrentVolume()
              },
            },
          ],
          { cancelable: false },
        )
      })
    }

    // Run volume test
    testCurrentVolume()
  }

  const validateRating = () => {
    // Respond if no rating selected
    if (volumeRating === undefined) {
      Alert.alert(
        'Rate the volume',
        'Please use the rating scale to describe how you felt about the played sound',
      )
    }

    // User finds volume painful, let's verify they want to continue
    else if (volumeRating === 9) {
      Alert.alert(
        'Are you sure',
        'You may hear sounds at this volume multiple times during the experiment. Do you think you can tolerate this volume?',
        [
          {
            text: 'Yes',
            onPress: () => onFinishCalibration(volume.current),
          },
          {
            text: 'No',
            onPress: () => setStage(3),
          },
        ],
        { cancelable: false },
      )
    }

    // See if rating is beyond threshold
    else if (volumeRating > 5) {
      onFinishCalibration(volume.current)
    }
  }

  const resetCalibration = () => {
    volume.current = 0.5
    setVolumeRating(undefined)
    startCalibration()
  }

  return (
    <Box
      flex={1}
      alignItems="center"
      pt={24}
      px={8}
      backgroundColor="greenPrimary"
    >
      <Entypo name="sound" size={100} color={palette.darkGrey} />

      <Text mt={8} variant="caption" textAlign="center">
        For this experiment it is important that the volume of the sound is
        uncomfortable but not painful.
      </Text>

      {/* Instruction Stage */}
      {stage == 0 && (
        <Box
          flex={1}
          mt={15}
          pb={14}
          justifyContent="flex-end"
          alignItems="center"
        >
          <Text pb={10} variant="caption2" textAlign="center">
            Once you click the button below you will be asked to rate the volume
            played through your headphones.
          </Text>
          <Button
            variant="primary"
            label="Start"
            alignSelf="flex-end"
            onPress={startCalibration}
          />
        </Box>
      )}

      {/* Stimuli Countdown */}
      {stage == 1 && countdown > 0 && (
        <Text variant="heading" fontSize={100} mt={24}>
          {countdown}
        </Text>
      )}

      {/* Volume Rating Scale */}
      {stage == 2 && (
        <Box
          flex={1}
          mt={15}
          pb={14}
          justifyContent="flex-end"
          alignItems="center"
        >
          <TrialRatingScale
            anchorLabelLeft="Quiet"
            anchorLabelCenter="Loud"
            anchorLabelRight="Painful"
            lockFirstRating={false}
            onChange={(rating) => setVolumeRating(rating)}
          />
          <Button variant="primary" label="Next" onPress={validateRating} />
        </Box>
      )}

      {/* Incorrect Reading Block */}
      {stage == 3 && (
        <Box
          flex={1}
          mt={15}
          pb={14}
          justifyContent="flex-end"
          alignItems="center"
        >
          <Text pb={10} variant="caption2" textAlign="center">
            We will now take you back to the calibration screen to try another
            volume.
          </Text>
          <Button
            variant="primary"
            label="Try Again"
            alignSelf="flex-end"
            onPress={resetCalibration}
          />
        </Box>
      )}
    </Box>
  )
}

VolumeCalibrationScreen.screenID = 'VolumeCalibration'
