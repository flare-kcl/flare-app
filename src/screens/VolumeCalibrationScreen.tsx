import { useState, useRef, useEffect } from 'react'
import { Entypo } from '@expo/vector-icons'
import { Text, Box, Button, RatingScale, SafeAreaView } from '@components'
import { palette } from '@utils/theme'
import { useAlert } from '@utils/AlertProvider'
import AudioSensor from '@utils/AudioSensor'
import { UnconditionalStimulusRef } from '@utils/hooks'

type VolumeCalibrationScreenProps = {
  unconditionalStimulus?: UnconditionalStimulusRef
  volumeIncrements: number[]
  onFinishCalibration: (volume: number, volumeRating: number) => void
}

enum VolumeCalibrationStages {
  Intro = 0,
  Countdown = 1,
  Rating = 2,
  Error = 3,
}

export const VolumeCalibrationScreen: React.FunctionComponent<VolumeCalibrationScreenProps> = ({
  unconditionalStimulus,
  volumeIncrements,
  onFinishCalibration,
}) => {
  const Alert = useAlert()
  const volumeIndex = useRef(0)
  const volumeScale = volumeIncrements
  const [stage, setStage] = useState(VolumeCalibrationStages.Intro)
  const [countdown, setCountdown] = useState(3)
  const [volumeRating, setVolumeRating] = useState(undefined)

  const incrementVolume = () => {
    if (volumeIndex.current < volumeScale.length - 1) {
      volumeIndex.current = volumeIndex.current + 1
    }
  }

  const decrementVolume = () => {
    if (volumeIndex.current > 0) {
      volumeIndex.current = volumeIndex.current - 1
    }
  }

  // Regain focus to AudioSensor after playing sounds
  useEffect(() => {
    return async () => {
      await AudioSensor.focus()
    }
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

  const startCalibration = () => {
    // Show countdown timer
    setStage(VolumeCalibrationStages.Countdown)

    // Trigger Countdown
    const testCurrentVolume = () => {
      setCountdown(3)
      decreaseCountdown(3, async () => {
        // Play Sound
        const volume = volumeScale[volumeIndex.current]
        await unconditionalStimulus.setVolume(volume)
        await unconditionalStimulus.playSound()

        // Ask participant what they thought
        Alert.alert(
          'How was that?',
          'Is the volume of the sound uncomfortable?',
          [
            {
              label: 'Yes',
              onPressDismiss: () => {
                // Switch to volume rating
                setStage(VolumeCalibrationStages.Rating)
              },
            },
            {
              label: 'No',
              onPress: () => {
                // If reached max volume
                if (volumeScale[volumeIndex.current] >= 1.0) {
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
      })
    }

    // Run volume test
    testCurrentVolume()
  }

  const validateRating = () => {
    const volume = volumeScale[volumeIndex.current]

    // If sound is painful then decrement one step and repeat calibration
    if (volumeRating == 10) {
      decrementVolume()
      setStage(VolumeCalibrationStages.Error)
    }

    // User finds volume painful, let's verify they want to continue
    else if (volumeRating === 9) {
      Alert.alert(
        'Are you sure?',
        'You may hear sounds at this volume multiple times during the experiment. Do you think you can tolerate this volume?',
        [
          {
            label: 'Yes',
            onPressDismiss: () => onFinishCalibration(volume, volumeRating),
          },
          {
            label: 'No',
            onPressDismiss: () => {
              decrementVolume()
              setStage(VolumeCalibrationStages.Error)
            },
          },
        ],
        'yellow',
      )
    }

    // If at max volume and below threshold continue
    else if (volume >= 1) {
      onFinishCalibration(volume, volumeRating)
    }

    // See if rating is beyond threshold
    else if (volumeRating > 5) {
      onFinishCalibration(volume, volumeRating)
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
      <Box flex={1} alignItems="center" pt={{ s: 5, m: 10 }}>
        <Entypo name="sound" size={80} color={palette.darkGrey} />

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
            fontFamily="Inter-Medium"
            fontSize={80}
            mt={10}
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
            mt={{
              s: 8,
              m: 15,
            }}
            pb={6}
            px={1}
            justifyContent="flex-end"
            alignItems="center"
          >
            <Text variant="caption2" mb={2}>
              Please rate the volume of the sound
            </Text>
            <RatingScale
              anchorLabelLeft="Quiet"
              anchorLabelCenter="Loud"
              anchorLabelRight="Painful"
              lockFirstRating={false}
              onChange={(rating) => setVolumeRating(rating)}
              ratingOptions={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
              minAnchorHeight={0}
            />
            <Box px={5}>
              <Button
                variant="primary"
                label="Next"
                disabled={volumeRating === undefined}
                opacity={volumeRating === undefined ? 0.4 : 1}
                onPress={validateRating}
              />
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
