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
      pt={24}
      px={5}
    >
      <Text variant="instructionDescription" mb={10}>
        Make sure your device is not in silent mode. You should currently be
        hearing a repeating noise being played.
      </Text>
      <Text variant="instructionActionLabel" px={6}>
        Set your volume to 100% to continue
      </Text>

      {volume !== undefined && (
        <Text mt={10} fontWeight="bold" fontSize={50} color="purple">
          {(volume * 100).toFixed(0)}%
        </Text>
      )}

      {volume === 1 && (
        <Box flex={1} justifyContent="flex-end" pb={14}>
          <Button variant="primary" label="Next" onPress={onNext} />
        </Box>
      )}
    </Box>
  )
}
