import { useEffect, useState, useRef } from 'react'
import { useSelector } from 'react-redux'
import { Audio, InterruptionModeIOS, InterruptionModeAndroid } from 'expo-av'
import * as Sentry from '@sentry/react-native'
import { experimentSelector } from '@redux/selectors'
import AudioSensor from './AudioSensor'
import { Alert } from 'react-native'

Audio.setAudioModeAsync({
  allowsRecordingIOS: false,
  staysActiveInBackground: true,
  interruptionModeIOS: InterruptionModeIOS.DoNotMix,
  playsInSilentModeIOS: true,
  shouldDuckAndroid: true,
  interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
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
      return new Promise(async (resolve, reject) => {
        try {
          // Load sound with stored volume
          const { sound } = await Audio.Sound.createAsync(
            experiment.definition.unconditionalStimulus,
            {
              volume: volume,
              shouldPlay: false,
              androidImplementation: 'MediaPlayer',
              progressUpdateIntervalMillis: 10,
            },
          )

          // Get Duration of sound (max 1000ms)
          const status = await sound.getStatusAsync()

          if (!status.isLoaded) {
            throw new Error('Sound not loaded')
          }

          const duration =
            status.durationMillis <= 1000 ? status.durationMillis : 1000

          const playSound = async (): Promise<Boolean> => {
            return new Promise(async (resolve, reject) => {
              // Play sound file from begining
              await sound.setPositionAsync(0)
              await sound.playAsync()

              const onSoundFinished = async () => {
                // Stop any playback
                try {
                  await sound.stopAsync()
                } catch (e) {
                  // Ignore 'Seeking interrupted.' error
                  if (e.message !== 'Seeking interrupted.') {
                    // If not, rethrow error
                    throw e
                  }
                }

                // Regain focus to audio sensor
                AudioSensor.focus()
                // Resolve function
                resolve(true)
              }

              sound.setOnPlaybackStatusUpdate(async (update) => {
                if (!update.isLoaded) return

                // Resolve promise when audio is finished
                if (update.didJustFinish) {
                  onSoundFinished()
                }

                // Resolve if audio has suprassed 1000ms
                if (
                  update.positionMillis >= 1000 &&
                  status.durationMillis > 1000
                ) {
                  onSoundFinished()
                }
              })
            })
          }

          const setVolume = async (volume: number) => {
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
          reject(err)

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
    if (experiment.definition != null && !loaded) {
      getAudioRef().then((ref) => {
        audioRef.current = ref
        setLoaded(true)
      })
    }
  }, [experiment?.definition])

  // Ensure that volume is always updated
  useEffect(() => {
    if (loaded) {
      audioRef.current.setVolume(volume)
    }
  }, [volume])

  return loaded ? audioRef.current : undefined
}

export const useHeadphonesConnection = (onConnectionChange) => {
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    // Initial check on mount
    checkHeadphonesConnection()

    // Check headphones are connected every second
    const intervalId = setInterval(() => {
      checkHeadphonesConnection()
    }, 1000)

    return () => {
      clearInterval(intervalId)
    }
  }, [])

  const checkHeadphonesConnection = async () => {
    try {
      const isConnected = await AudioSensor.isHeadphonesConnected()
      setConnected(isConnected)
      onConnectionChange && onConnectionChange(isConnected)
    } catch (error) {
      console.error('Error checking headphone connection:', error)
    }
  }

  return connected
}
