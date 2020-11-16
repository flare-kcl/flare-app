import { useState, useEffect, useRef } from 'react'
import { Audio } from 'expo-av'
import { ImageSourcePropType } from 'react-native'
import { Box, TrialImageStack, TrialRatingScale, Text } from '@components'
import { ModuleScreen } from './BaseScreen'

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
}

export const FearConditioningTrialScreen: ModuleScreen<FearConditioningTrialScreenParams> = ({
  route,
}) => {
  const {
    stimulusImage,
    contextImage,
    trialLength,
    reinforced,
    ratingDelay,
    onTrialEnd,
    trialDelay,
  } = route.params
  const [showTrial, setShowTrial] = useState<boolean>(false)
  const [rating, setRating] = useState<number>()
  const [showScale, setShowScale] = useState(false)

  // Keep reference of timers
  const soundRef = useRef<Audio.Sound>()
  const startTimeRef = useRef<number>()
  const reactionTimeRef = useRef<number>()
  const endTimerRef = useRef<any>()
  const soundTimerRef = useRef<any>()
  const scaleTimerRef = useRef<any>()

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
      await soundRef.current.playAsync()
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    setTimeout(() => {
      // Setup sound object before setting timers
      setupSound()

      // Set timer for end of trial
      endTimerRef.current = setTimeout(() => {
        onTrialEnd({
          rating: rating,
          skipped: rating === undefined,
          startTime: startTimeRef.current,
          decisionTime: reactionTimeRef.current,
        })
      }, trialLength * 1000)

      // Set timer for sound, 500ms before end
      if (reinforced) {
        soundTimerRef.current = setTimeout(
          async () => playSound(),
          trialLength * 1000 - 500,
        )
      }

      // Set timer for scale reveal
      scaleTimerRef.current = setTimeout(() => {
        // Show scale
        setShowScale(true)
      }, ratingDelay * 1000)
    }, trialDelay ?? 0)

    return () => {
      // Delete sound object
      soundRef.current?.unloadAsync()

      // Delete timers
      clearTimeout(endTimerRef.current)
      clearTimeout(soundTimerRef.current)
      clearTimeout(scaleTimerRef.current)
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
            onChange={(rating) => {
              // Update state
              setRating(rating)
              // Record time to rate
              reactionTimeRef.current = Date.now()
            }}
          />
        )}
      </Box>
    </>
  )
}

// Set the screen ID for navigator
FearConditioningTrialScreen.screenID = 'trial'
