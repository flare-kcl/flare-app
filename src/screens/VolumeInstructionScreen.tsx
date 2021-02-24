import { useRef, useState, useEffect } from 'react'
import { EmitterSubscription } from 'react-native'
import { Box, Text, Button } from '@components'
import AudioSensor from '@utils/AudioSensor'

type VolumeInstructionScreenProps = {
  onNext: () => void
}

export const VolumeInstructionScreen: React.FunctionComponent<VolumeInstructionScreenProps> = ({
  onNext,
}) => {
  const [volume, setVolume] = useState<number>()
  const volumeSensorRef = useRef<EmitterSubscription>()

  // Continuously attach to AV focus
  useEffect(() => {
    AudioSensor.focus()
  })

  useEffect(() => {
    // Set initial value
    AudioSensor.getCurrentVolume().then((volume) => setVolume(volume))

    // Listen to volume changes
    volumeSensorRef.current = AudioSensor.addVolumeListener((volume) => {
      setVolume(volume)
    })

    // Detach listener on unmount
    return () => {
      volumeSensorRef.current.remove()
    }
  }, [])

  return (
    <Box
      flex={1}
      alignItems="center"
      justifyContent="flex-start"
      pt={{ s: 8, m: 12 }}
      px={5}
    >
      <Text variant="instructionHeading" mb={10}>
        Increase your volume to 100%
      </Text>

      <Text variant="instructionDescription" mb={10}>
        Make sure your device is not in silent mode.
      </Text>

      {volume !== undefined && (
        <Text fontWeight="bold" fontSize={60} color="purple">
          {(volume * 100).toFixed(0)}%
        </Text>
      )}

      <Box flex={1} justifyContent="flex-end" pb={6}>
        <Text variant="caption2" px={6} mb={3} textAlign="center">
          Set your volume to 100% to continue
        </Text>
        <Button
          variant="primary"
          label="Next"
          onPress={onNext}
          opacity={volume === 1 ? 1 : 0}
          disabled={volume < 1}
        />
      </Box>
    </Box>
  )
}
