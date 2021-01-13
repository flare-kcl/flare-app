import { memo, useState, useEffect, useRef } from 'react'
import { EmitterSubscription, ImageSourcePropType, Image } from 'react-native'
import { useDispatch } from 'react-redux'

import {
  Box,
  TrialImageStack,
  RatingScale,
  Interval,
  AlertRef,
} from '@components'
import AudioSensor from '@utils/AudioSensor'
import { useAlert } from '@utils/AlertProvider'
import { UnconditionalStimulusRef } from '@utils/hooks'

type FearConditioningTrialScreenProps = {
  contextImage: ImageSourcePropType
  stimulusImage: ImageSourcePropType
  unconditionalStimulus: UnconditionalStimulusRef
  trialLength: number
  ratingDelay: number
  reinforced: boolean
  trialDelay: number
  anchorLabelLeft: string
  anchorLabelCenter: string
  anchorLabelRight: string
  onTrialEnd: (response: FearConditioningTrialResponse) => void
}

export type FearConditioningTrialResponse = {
  rating: number
  skipped: boolean
  startTime: number
  decisionTime: number
  volume: number
  headphonesConnected: boolean
}

export const FearConditioningTrialScreen: React.FunctionComponent<FearConditioningTrialScreenProps> = memo(
  ({
    stimulusImage,
    contextImage,
    unconditionalStimulus,
    trialLength,
    reinforced,
    ratingDelay,
    onTrialEnd,
    trialDelay,
    anchorLabelLeft,
    anchorLabelCenter,
    anchorLabelRight,
  }) => {
    const Alert = useAlert()
    const [showTrial, setShowTrial] = useState<boolean>(false)
    const [showScale, setShowScale] = useState(false)

    // Keep reference of timers
    const startTimeRef = useRef<number>()
    const reactionTimeRef = useRef<number>()
    const endTimerRef = useRef<any>()
    const soundTimerRef = useRef<any>()
    const scaleTimerRef = useRef<any>()
    const ratingValueRef = useRef<any>()
    const mountedTimerRef = useRef<any>(false)
    const headphoneSensorListener = useRef<EmitterSubscription>()
    const headphoneRef = useRef<AlertRef>()

    const finishTrial = (delay: number) => {
      if (endTimerRef.current === undefined) {
        endTimerRef.current = setTimeout(async () => {
          onTrialEnd({
            rating: ratingValueRef.current,
            skipped: ratingValueRef.current === undefined,
            startTime: startTimeRef.current,
            decisionTime: reactionTimeRef.current,
            volume: await AudioSensor.getCurrentVolume(),
            headphonesConnected: await AudioSensor.isHeadphonesConnected(),
          })
        }, delay)
      }
    }

    const showHeadphoneAlert = (connected: boolean) => {
      // Show user a toast warning
      if (headphoneRef.current === undefined && connected === false) {
        headphoneRef.current = Alert.alert(
          'Reconnect Headphones',
          'Please reconnect your headphones to continue.',
          [
            {
              label: 'Continue',
              onPress: async () => {
                // Reopen prompt if they have not been connected
                headphoneRef.current = undefined
                showHeadphoneAlert(await AudioSensor.isHeadphonesConnected())
              },
            },
          ],
        )
      } else if (connected) {
        // If we detect a reconnect then dismiss alert
        headphoneRef.current?.dismiss()
        headphoneRef.current = undefined
      }
    }

    useEffect(() => {
      // Setup Headphone Listening
      AudioSensor.isHeadphonesConnected().then(showHeadphoneAlert)
      headphoneSensorListener.current = AudioSensor.addHeadphonesListener(
        showHeadphoneAlert,
      )

      mountedTimerRef.current = setTimeout(() => {
        // Set timer for sound, 500ms before end
        soundTimerRef.current = setTimeout(async () => {
          if (reinforced) {
            await unconditionalStimulus.playSound()
            finishTrial(0)
          } else {
            finishTrial(unconditionalStimulus.duration)
          }
        }, trialLength - unconditionalStimulus.duration)

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

        // Disconnect volume listener
        headphoneSensorListener.current?.remove()

        // Remove toast warning
        headphoneRef.current?.dismiss()
      }
    }, [])

    return (
      <>
        {/* Show marker when delaying trial */}
        {showTrial === false && <Interval />}

        {/* Set opacity to zero during inter-trial delay to enable loading of images */}
        <Box flex={1} opacity={showTrial ? 1 : 0}>
          <Box height="55%" mt={8}>
            <TrialImageStack
              contextImage={contextImage}
              stimulusImage={stimulusImage}
            />
          </Box>
          {showScale && (
            <RatingScale
              lockFirstRating
              anchorLabelLeft={anchorLabelLeft}
              anchorLabelCenter={anchorLabelCenter}
              anchorLabelRight={anchorLabelRight}
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
