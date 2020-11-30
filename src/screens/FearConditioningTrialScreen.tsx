import { memo, useState, useEffect, useRef } from 'react'
import { Audio } from 'expo-av'
import { EmitterSubscription, ImageSourcePropType } from 'react-native'
import { useDispatch } from 'react-redux'
import { recordEvent } from '@redux/reducers'
import { Box, TrialImageStack, TrialRatingScale, Text } from '@components'
import { ModuleScreen } from './BaseScreen'
import AudioSensor from '@utils/AudioSensor'

Audio.setAudioModeAsync({
  allowsRecordingIOS: false,
  staysActiveInBackground: false,
  interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
  playsInSilentModeIOS: true,
  shouldDuckAndroid: true,
  interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
  playThroughEarpieceAndroid: false,
})

type FearConditioningTrialScreenParams = {
  contextImage: ImageSourcePropType
  stimulusImage: ImageSourcePropType
  trialLength: number
  ratingDelay: number
  reinforced: boolean
  trialDelay: number
  onTrialEnd: (response: FearConditioningTrialResponse) => void
}

export type FearConditioningTrialResponse = {
  rating: number
  skipped: boolean
  startTime: number
  decisionTime: number
  volume: number
}

export const FearConditioningTrialScreen: React.FunctionComponent<FearConditioningTrialScreenParams> = memo(
  ({
    stimulusImage,
    contextImage,
    trialLength,
    reinforced,
    ratingDelay,
    onTrialEnd,
    trialDelay,
  }) => {
    const dispatch = useDispatch()
    const [showTrial, setShowTrial] = useState<boolean>(false)
    const [showScale, setShowScale] = useState(false)

    // Keep reference of timers
    const soundRef = useRef<Audio.Sound>()
    const startTimeRef = useRef<number>()
    const reactionTimeRef = useRef<number>()
    const endTimerRef = useRef<any>()
    const soundTimerRef = useRef<any>()
    const scaleTimerRef = useRef<any>()
    const ratingValueRef = useRef<any>()
    const mountedTimerRef = useRef<any>(false)
    const soundSensorListener = useRef<EmitterSubscription>()

    const setupSound = async () => {
      try {
        const { sound } = await Audio.Sound.createAsync(
          require('../assets/sounds/ding.wav'),
          {
            shouldPlay: false,
          },
        )

        // Assign sound object to ref
        soundRef.current = sound
      } catch (error) {
        console.error(error)
      }
    }

    const playSound = async () => {
      try {
        await soundRef.current?.playAsync()
      } catch (error) {
        console.error(error)
      }
    }

    useEffect(() => {
      // Setup sound object before setting timers
      setupSound()

      // Setup Volume Listening
      soundSensorListener.current = AudioSensor.addVolumeListener(
        (volume: number) => {
          dispatch(
            recordEvent({
              eventType: 'VolumeChange',
              value: String(volume),
              recorded: Date.now(),
            }),
          )
        },
      )

      mountedTimerRef.current = setTimeout(() => {
        // Set timer for end of trial
        endTimerRef.current = setTimeout(async () => {
          onTrialEnd({
            rating: ratingValueRef.current,
            skipped: ratingValueRef.current === undefined,
            startTime: startTimeRef.current,
            decisionTime: reactionTimeRef.current,
            volume: await AudioSensor.getCurrentVolume(),
          })
        }, trialLength)

        // Set timer for sound, 500ms before end
        if (reinforced) {
          soundTimerRef.current = setTimeout(
            async () => playSound(),
            trialLength - 500,
          )
        }

        // Set timer for scale reveal
        scaleTimerRef.current = setTimeout(() => {
          // Show scale
          setShowScale(true)
        }, ratingDelay)

        // Show the trial
        setShowTrial(true)

        // Mark the start time
        startTimeRef.current = Date.now()
      }, trialDelay ?? 0)

      return () => {
        // Delete timers
        clearTimeout(mountedTimerRef.current)
        clearTimeout(soundTimerRef.current)
        clearTimeout(endTimerRef.current)
        clearTimeout(scaleTimerRef.current)

        // Delete sound object
        soundRef.current?.unloadAsync()

        // Disconnect volume listener
        soundSensorListener.current.remove()
      }
    }, [])

    return (
      <>
        {/* Show marker when delaying trial */}
        {showTrial === false && (
          <Box
            flex={1}
            width="100%"
            position="absolute"
            top={0}
            pt={24}
            alignItems="center"
          >
            <Text fontWeight="bold" fontSize={120}>
              +
            </Text>
          </Box>
        )}

        {/* Set opacity to zero during inter-trial delay to enable loading of images */}
        <Box flex={1} opacity={showTrial ? 1 : 0}>
          <Box height="70%">
            <TrialImageStack
              contextImage={contextImage}
              stimulusImage={stimulusImage}
            />
          </Box>
          {showScale && (
            <TrialRatingScale
              onChange={(value) => {
                // Record time to rate
                reactionTimeRef.current = Date.now()
                // Update state
                ratingValueRef.current = value
              }}
            />
          )}
        </Box>
      </>
    )
  },
)
