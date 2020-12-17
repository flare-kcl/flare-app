import { useState, useRef } from 'react'
import { Audio } from 'expo-av'
import { Entypo } from '@expo/vector-icons'
import { Text, Box, Button, RatingScale, SafeAreaView } from '@components'
import { palette } from '@utils/theme'
import { useAlert } from '@utils/AlertProvider'

type VolumeCalibrationScreenParams = {
  onFinishCalibration: (volume: number) => void
}

enum VolumeCalibrationStages {
  Intro = 0,
  Countdown = 1,
  Rating = 2,
  Error = 3,
}

export const VolumeCalibrationScreen: React.FunctionComponent<VolumeCalibrationScreenParams> = ({
  onFinishCalibration,
}) => {
  const Alert = useAlert()
  const volume = useRef(0.5)
  const soundRef = useRef<Audio.Sound>()
  const [stage, setStage] = useState(VolumeCalibrationStages.Intro)
  const [countdown, setCountdown] = useState(3)
  const [volumeRating, setVolumeRating] = useState(undefined)

  // Edit volume value without floating point errors
  const incrementVolume = () =>
    Math.min((volume.current = +(volume.current + 0.05).toFixed(2)), 1.0)
  const decrementVolume = () =>
    Math.max((volume.current = +(volume.current - 0.05).toFixed(2)), 0.1)

  const playStimuli = async () => {
    return new Promise(async (resolve, _) => {
      // Setup audio
      if (soundRef.current === undefined) {
        // Load audio file
        const { sound } = await Audio.Sound.createAsync(
          require('../assets/sounds/ding.wav'),
          {
            shouldPlay: false,
            volume: volume.current,
          },
        )

        // Assign to ref
        soundRef.current = sound
      }

      // Set the volume
      await soundRef.current.setVolumeAsync(volume.current)

      // Set update handler
      soundRef.current.setOnPlaybackStatusUpdate((update) => {
        if (update.didJustFinish) {
          resolve(true)
        }
      })

      // Play the sound
      await soundRef.current.playFromPositionAsync(0)
    })
  }

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

  const startCalibration = () => {
    // Show countdown timer
    setStage(VolumeCalibrationStages.Countdown)

    // Trigger Countdown
    const testCurrentVolume = () => {
      setCountdown(3)
      decreaseCountdown(3, async () => {
        // Play Sound
        const didPlay = await playStimuli()

        // Ask participant what they thought
        if (didPlay) {
          Alert.alert(
            'How was that?',
            'Is the volume of the sound uncomfortable?',
            [
              {
                label: 'Yes',
                onPress: () => {
                  // Switch to volume rating
                  setStage(VolumeCalibrationStages.Rating)
                },
              },
              {
                label: 'No',
                onPress: () => {
                  // If reached max volume
                  if (volume.current >= 1.0) {
                    setStage(VolumeCalibrationStages.Rating)
                  } else {
                    // Increase volume and play again
                    incrementVolume()
                    testCurrentVolume()
                  }
                },
              },
              {
                label: 'Listen Again',
                onPress: () => {
                  // Restart countdown
                  testCurrentVolume()
                },
              },
            ],
            'yellow',
          )
        }
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
        [],
        'yellow',
      )
    }

    // If sound is painful then decrement one step and repeat calibration
    else if (volumeRating == 10) {
      decrementVolume()
      setStage(VolumeCalibrationStages.Error)
    }

    // User finds volume painful, let's verify they want to continue
    else if (volumeRating === 9) {
      Alert.alert(
        'Are you sure',
        'You may hear sounds at this volume multiple times during the experiment. Do you think you can tolerate this volume?',
        [
          {
            label: 'Yes',
            onPress: () => onFinishCalibration(volume.current),
          },
          {
            label: 'No',
            onPress: () => {
              decrementVolume()
              setStage(VolumeCalibrationStages.Error)
            },
          },
        ],
        'yellow',
      )
    }

    // If at max volume and below threshold continue
    else if (volume.current >= 1) {
      onFinishCalibration(volume.current)
    }

    // See if rating is beyond threshold
    else if (volumeRating > 5) {
      onFinishCalibration(volume.current)
    }

    // If is below threshold
    else {
      incrementVolume()
      setStage(VolumeCalibrationStages.Error)
    }
  }

  const resetCalibration = () => {
    setVolumeRating(undefined)
    startCalibration()
  }

  return (
    <SafeAreaView flex={1}>
      <Box flex={1} alignItems="center" pt={24}>
        <Entypo name="sound" size={100} color={palette.darkGrey} />

        <Text mt={8} variant="caption" textAlign="center" px={6}>
          For this experiment it is important that the volume of the sound is
          uncomfortable but not painful.
        </Text>

        {/* Instruction Stage */}
        {stage == VolumeCalibrationStages.Intro && (
          <Box
            flex={1}
            mt={15}
            pb={6}
            px={6}
            justifyContent="flex-end"
            alignItems="center"
          >
            <Text mb={6} variant="caption2" textAlign="center">
              Once you click the button below you will be asked to rate the
              volume played through your headphones.
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
        {stage == VolumeCalibrationStages.Countdown && countdown > 0 && (
          <Text
            fontWeight="500"
            width="100%"
            fontSize={100}
            mt={24}
            textAlign="center"
            color="darkGrey"
          >
            {countdown}
          </Text>
        )}

        {/* Volume Rating Scale */}
        {stage == VolumeCalibrationStages.Rating && (
          <Box
            flex={1}
            mt={15}
            pb={6}
            px={1}
            justifyContent="flex-end"
            alignItems="center"
          >
            <RatingScale
              anchorLabelLeft="Quiet"
              anchorLabelCenter="Loud"
              anchorLabelRight="Painful"
              lockFirstRating={false}
              onChange={(rating) => setVolumeRating(rating)}
              ratingOptions={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
            />
            <Box px={5}>
              <Button variant="primary" label="Next" onPress={validateRating} />
            </Box>
          </Box>
        )}

        {/* Incorrect Reading Block */}
        {stage == VolumeCalibrationStages.Error && (
          <Box
            flex={1}
            mt={15}
            pb={6}
            px={5}
            justifyContent="flex-end"
            alignItems="center"
          >
            <Text mb={6} variant="caption2" textAlign="center">
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
    </SafeAreaView>
  )
}
