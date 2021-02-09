import { useEffect, useState, useRef } from 'react'
import { useSelector } from 'react-redux'
import { Audio } from 'expo-av'
import * as Sentry from '@sentry/react-native'
import { experimentSelector } from '@redux/selectors'
import AudioSensor from './AudioSensor'

Audio.setAudioModeAsync({
  allowsRecordingIOS: false,
  staysActiveInBackground: true,
  interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_MIX_WITH_OTHERS,
  playsInSilentModeIOS: true,
  shouldDuckAndroid: false,
  interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS,
  playThroughEarpieceAndroid: false,
})

export type UnconditionalStimulusRef = {
  volume: number
  duration: number
  sound: Audio.Sound
  playSound: () => Promise<Boolean>
  setVolume: (volume?: number) => Promise<void>
}

export const useUnconditionalStimulus = ():
  | UnconditionalStimulusRef
  | undefined => {
  const experiment = useSelector(experimentSelector)
  const audioRef = useRef<UnconditionalStimulusRef | undefined>()
  const [loaded, setLoaded] = useState(false)
  const volume = experiment.volume ?? 1

  useEffect(() => {
    const getAudioRef = (): Promise<UnconditionalStimulusRef> => {
      return new Promise(async (resolve, _) => {
        try {
          // Load sound with stored volume
          const { sound } = await Audio.Sound.createAsync(
            experiment.definition.unconditionalStimulus,
            {
              volume: volume,
              shouldPlay: false,
            },
          )

          // Get Duration of sound (max 1000ms)
          const status = await sound.getStatusAsync()
          const duration =
            status.durationMillis <= 1000 ? status.durationMillis : 1000

          const playSound = async (): Promise<Boolean> => {
            return new Promise(async (resolve, reject) => {
              // Play sound file from begining
              await sound.playFromPositionAsync(0)

              const onSoundFinished = async () => {
                // Stop any playback
                sound.stopAsync()
                // Regain focus to audio sensor
                AudioSensor.focus()
                // Resolve function
                resolve(true)
              }

              sound.setOnPlaybackStatusUpdate(async (update) => {
                // Resolve promise when audio is finished
                if (update.didJustFinish) {
                  onSoundFinished()
                }

                // Resolve if audio has suprassed 1000ms
                if (update.positionMillis >= 1000) {
                  onSoundFinished()
                }
              })
            })
          }

          const setVolume = async (volume) => {
            // Update ref and sound object
            audioRef.current.volume = volume
            await audioRef.current.sound.setVolumeAsync(volume)
          }

          return resolve({
            sound,
            volume,
            duration,
            setVolume,
            playSound,
          })
        } catch (err) {
          // Record error
          Sentry.captureMessage(err)
          console.error(err)

          // Return invalid sound object
          return resolve({
            volume: 0,
            duration: 0,
            sound: null,
            playSound: () => null,
            setVolume: () => null,
          })
        }
      })
    }

    // Report errors if sound provided bad config
    if (volume == null || volume == 0) {
      Sentry.captureMessage('Invalid volume parameter used by trial.')
    }

    // Create Audio Refernece
    if (experiment.definition != null) {
      getAudioRef().then((ref) => {
        audioRef.current = ref
        setLoaded(true)
      })
    }
  }, [experiment?.definition])

  return loaded ? audioRef.current : undefined
}
