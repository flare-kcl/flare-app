import { useState, useRef, useEffect } from 'react'
import { Audio } from 'expo-av'
import { Entypo } from '@expo/vector-icons'
import { Text, Box, Button, RatingScale, SafeAreaView } from '@components'
import { palette } from '@utils/theme'
import { useAlert } from '@utils/AlertProvider'
import AudioSensor from '@utils/AudioSensor'

type VolumeCalibrationScreenProps = {
  unconditionalStimulus: {
    uri: string
  }
  onFinishCalibration: (volume: number) => void
}

enum VolumeCalibrationStages {
  Intro = 0,
  Countdown = 1,
  Rating = 2,
  Error = 3,
}

Audio.setAudioModeAsync({
  allowsRecordingIOS: false,
  staysActiveInBackground: true,
  interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_MIX_WITH_OTHERS,
  playsInSilentModeIOS: true,
  shouldDuckAndroid: false,
  interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS,
  playThroughEarpieceAndroid: false,
})

export const VolumeCalibrationScreen: React.FunctionComponent<VolumeCalibrationScreenProps> = ({
  unconditionalStimulus,
  onFinishCalibration,
}) => {
  const Alert = useAlert()
  const volumeIndex = useRef(0)
  const volumeScale = [0.5, 0.65, 0.8, 0.9, 0.95, 1]
  const soundRef = useRef<Audio.Sound>()
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

  const playStimuli = async () => {
    const volume = volumeScale[volumeIndex.current]
    return new Promise(async (resolve, _) => {
      // Setup audio
      if (soundRef.current === undefined) {
        // Load audio file
        const { sound } = await Audio.Sound.createAsync(unconditionalStimulus, {
          shouldPlay: false,
          volume,
        })

        // Assign to ref
        soundRef.current = sound
      }

      // Set update handler
      soundRef.current.setOnPlaybackStatusUpdate((update) => {
        if (update.didJustFinish) {
          resolve(true)
        }
      })

      // Play the sound
      await soundRef.current.setVolumeAsync(volume)
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
        }
      })
    }

    // Run volume test
    testCurrentVolume()
  }

  const validateRating = () => {
    const volume = volumeScale[volumeIndex.current]
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
            onPress: () => onFinishCalibration(volume),
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
    else if (volume >= 1) {
      onFinishCalibration(volume)
    }

    // See if rating is beyond threshold
    else if (volumeRating > 5) {
      onFinishCalibration(volume)
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
      <Box flex={1} alignItems="center" pt={10}>
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
            fontWeight="500"
            width="100%"
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
