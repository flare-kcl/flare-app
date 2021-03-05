import { useState } from 'react'
import { Box, Text, Button, Image, ScrollView } from '@components'
import { useEffect } from 'react'
import AudioSensor from '@utils/AudioSensor'
import { AntDesign } from '@expo/vector-icons'
import { useRef } from 'react'
import { EmitterSubscription } from 'react-native'
import { palette } from '@utils/theme'
import { HeadphoneType } from '@containers/BasicInfoContainer'

type HeadphonesDetectionScreenProps = {
  headphoneType: HeadphoneType
  onNext: () => void
}

const HeadphoneImages = {
  on_ear: require('../assets/images/headphones/on-ear.jpg'),
  in_ear: require('../assets/images/headphones/in-ear.jpg'),
  over_ear: require('../assets/images/headphones/over-ear.jpg'),
}

export const HeadphonesDetectionScreen: React.FunctionComponent<HeadphonesDetectionScreenProps> = ({
  headphoneType,
  onNext,
}) => {
  const [connected, setConnected] = useState<boolean>()
  const headphonesSensorRef = useRef<EmitterSubscription>()

  useEffect(() => {
    // Set initial value
    AudioSensor.isHeadphonesConnected().then(setConnected)

    // Listen to volume changes
    headphonesSensorRef.current = AudioSensor.addHeadphonesListener(
      setConnected,
    )

    // Detach listener on unmount
    return () => {
      headphonesSensorRef.current.remove()
    }
  }, [])

  return (
    <Box flex={1} alignItems="center" pt={2} px={5}>
      <Box alignItems="center">
        <Image
          source={HeadphoneImages[headphoneType]}
          width={100}
          height={100}
          maxWidth={100}
          maxHeight={100}
          marginBottom={4}
        />

        <Text
          fontFamily="Inter-Bold"
          fontSize={22}
          color="darkGrey"
          textAlign="center"
          mb={8}
        >
          Please ensure you're wearing headphones.
        </Text>

        {connected == true && (
          <Box
            backgroundColor="white"
            height={80}
            width={80}
            borderRadius="round"
            alignItems="center"
            justifyContent="center"
          >
            <AntDesign
              name="checkcircle"
              size={70}
              color={palette.greenCorrect}
            />
          </Box>
        )}

        {connected == false && (
          <>
            <Box
              backgroundColor="white"
              height={80}
              width={80}
              borderRadius="round"
              alignItems="center"
              justifyContent="center"
            >
              <AntDesign name="closecircle" size={70} color={palette.red} />
            </Box>
            <Text variant="caption2" fontFamily="Inter" mt={8}>
              Plug in your headphones to continue.
            </Text>
          </>
        )}
      </Box>

      <Box flex={1} alignSelf="flex-end" justifyContent="flex-end" pb={6}>
        <Button
          variant="primary"
          label="Next"
          onPress={onNext}
          disabled={!connected}
          opacity={connected ? 1 : 0}
        />
      </Box>
    </Box>
  )
}
