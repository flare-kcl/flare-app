import { useState, useEffect, useRef } from 'react'
import { Audio } from 'expo-av'
import { ImageSourcePropType } from 'react-native'
import { Box, TrialImageStack, TrialRatingScale } from '@components'
import { ModuleScreen } from './BaseScreen'

type FearConditioningTrialScreenParams = {
  contextImage: ImageSourcePropType
  stimulusImage: ImageSourcePropType
  trialLength: number
  ratingDelay: number
  reinforced: boolean
  onTrialEnd: (rating: number) => void
}

Audio.setAudioModeAsync({
  allowsRecordingIOS: false,
  staysActiveInBackground: false,
  interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
  playsInSilentModeIOS: true,
  shouldDuckAndroid: true,
  interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
  playThroughEarpieceAndroid: false,
})

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
  } = route.params
  const [rating, setRating] = useState<number>(null)
  const [showScale, setShowScale] = useState(false)

  // Keep reference of timers
  const soundRef = useRef<Audio.Sound>()
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
    // Setup sound object before setting timers
    setupSound()

    // Set timer for end of trial
    endTimerRef.current = setTimeout(
      () => onTrialEnd(rating),
      trialLength * 1000,
    )

    // Set timer for sound, 500ms before end
    if (reinforced) {
      soundTimerRef.current = setTimeout(
        async () => playSound(),
        trialLength * 1000 - 500,
      )
    }

    // Set timer for scale reveal
    scaleTimerRef.current = setTimeout(
      () => setShowScale(true),
      ratingDelay * 1000,
    )

    return () => {
      // Delete sound object
      soundRef.current?.unloadAsync()

      // Delete timers
      clearTimeout(endTimerRef.current)
      clearTimeout(soundTimerRef.current)
      clearTimeout(scaleTimerRef.current)
    }
  })

  return (
    <Box flex={1}>
      <Box height="70%">
        <TrialImageStack
          contextImage={contextImage}
          stimulusImage={stimulusImage}
        />
      </Box>
      {showScale && (
        <TrialRatingScale onChange={(rating) => setRating(rating)} />
      )}
    </Box>
  )
}

// Set the screen ID for navigator
FearConditioningTrialScreen.screenID = 'trial'
