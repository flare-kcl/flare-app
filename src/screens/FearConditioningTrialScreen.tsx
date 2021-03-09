import { memo, useState, useEffect, useRef } from 'react'
import { EmitterSubscription, ImageSourcePropType, Image } from 'react-native'
import { useSelector } from 'react-redux'

import {
  Box,
  TrialImageStack,
  RatingScale,
  Interval,
  AlertRef,
  SafeAreaView,
} from '@components'
import AudioSensor from '@utils/AudioSensor'
import { useAlert } from '@utils/AlertProvider'
import AppStateMonitor from '@utils/AppStateMonitor'
import { UnconditionalStimulusRef } from '@utils/hooks'
import { PauseableTimer } from '@utils/timers'

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
  didLeaveIti: boolean
  didLeaveTask: boolean
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
    const focusState = useSelector((state) => state.appState)
    const [showTrial, setShowTrial] = useState<boolean>(false)
    const [showScale, setShowScale] = useState(false)

    // Keep reference of timers
    const startTimeRef = useRef<number>()
    const reactionTimeRef = useRef<number>()
    const itiLeaveRef = useRef<boolean>(false)
    const taskLeaveRef = useRef<boolean>(false)
    const endTimerRef = useRef<PauseableTimer>()
    const soundTimerRef = useRef<PauseableTimer>()
    const scaleTimerRef = useRef<PauseableTimer>()
    const mountedTimerRef = useRef<PauseableTimer>()
    const ratingValueRef = useRef<any>()
    const headphoneSensorListener = useRef<EmitterSubscription>()
    const headphoneRef = useRef<AlertRef>()

    const pauseTrial = () => {
      soundTimerRef.current?.pause()
      scaleTimerRef.current?.pause()
      mountedTimerRef.current?.pause()
      endTimerRef.current?.pause()
    }

    const resumeTrial = () => {
      AudioSensor.isHeadphonesConnected().then((showHeadphoneAlert) => {
        if (showHeadphoneAlert && focusState.type === 'active') {
          soundTimerRef.current?.resume()
          scaleTimerRef.current?.resume()
          mountedTimerRef.current?.resume()
          endTimerRef.current?.resume()
        }
      })
    }

    const finishTrial = (delay: number) => {
      if (endTimerRef.current === undefined) {
        endTimerRef.current = new PauseableTimer(async () => {
          onTrialEnd({
            rating: ratingValueRef.current,
            skipped: ratingValueRef.current === undefined,
            startTime: startTimeRef.current,
            decisionTime: reactionTimeRef.current,
            volume: await AudioSensor.getCurrentVolume(),
            headphonesConnected: await AudioSensor.isHeadphonesConnected(),
            didLeaveIti: itiLeaveRef.current,
            didLeaveTask: taskLeaveRef.current,
          })
        }, delay)
      }
    }

    const showHeadphoneAlert = (connected: boolean) => {
      // Show user a toast warning
      if (connected === false) {
        // Stop the timers
        pauseTrial()

        if (headphoneRef.current === undefined) {
          headphoneRef.current = Alert.alert(
            'Reconnect Headphones',
            'Please reconnect your headphones to continue.',
            [
              /* LEAVE BLANK */
            ],
          )
        }
      } else if (connected) {
        // If we detect a reconnect then dismiss alert
        headphoneRef.current?.dismiss()
        headphoneRef.current = undefined

        // Start timers again
        resumeTrial()
      }
    }

    // Pause trial on suspend
    useEffect(() => {
      if (focusState.type !== 'active') {
        pauseTrial()

        // Set the suspension flags
        if (showTrial) {
          taskLeaveRef.current = true
        } else {
          itiLeaveRef.current = true
        }
      } else {
        resumeTrial()
      }
    }, [focusState.type])

    useEffect(() => {
      // Check if app state is correct
      // Fixes bug where ITI can get stuck by spam suspending app
      AppStateMonitor.manualUpdate()

      // Setup Headphone Listening
      AudioSensor.isHeadphonesConnected().then(showHeadphoneAlert)
      headphoneSensorListener.current = AudioSensor.addHeadphonesListener(
        showHeadphoneAlert,
      )

      mountedTimerRef.current = new PauseableTimer(() => {
        // Set timer for sound, 500ms before end
        soundTimerRef.current = new PauseableTimer(async () => {
          // Hide scale
          setShowScale(false)

          // Play sound
          if (reinforced) {
            await unconditionalStimulus.playSound()
            finishTrial(0)
          } else {
            finishTrial(unconditionalStimulus.duration)
          }
        }, trialLength - unconditionalStimulus.duration)

        // Set timer for scale reveal
        scaleTimerRef.current = new PauseableTimer(() => {
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
        endTimerRef.current?.destroy()
        soundTimerRef.current?.destroy()
        scaleTimerRef.current?.destroy()
        mountedTimerRef.current?.destroy()

        // Disconnect volume listener
        headphoneSensorListener.current?.remove()

        // Remove toast warning
        headphoneRef.current?.dismiss()
      }
    }, [])

    return (
      <SafeAreaView flex={1} backgroundColor="white">
        {/* Show marker when delaying trial */}
        {showTrial === false && (
          <Box height="55%" backgroundColor="white">
            <TrialImageStack
              key="iti-image"
              stimulusImage={require('../assets/images/ITI.png')}
            />
          </Box>
        )}

        {/* Set opacity to zero during inter-trial delay to enable loading of images */}
        <Box flex={1} opacity={showTrial ? 1 : 0}>
          <Box height="55%">
            <TrialImageStack
              key="stimulus-image"
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
      </SafeAreaView>
    )
  },
)
