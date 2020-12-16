import { useState } from 'react'
import { Box, Text, Button, Image, SafeAreaView } from '@components'
import { useEffect } from 'react'
import AudioSensor from '@utils/AudioSensor'
import { Entypo, AntDesign } from '@expo/vector-icons'
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
    <SafeAreaView flex={1}>
      <Box
        flex={1}
        alignItems="center"
        justifyContent="flex-start"
        pt={24}
        px={5}
      >
        <Image
          source={HeadphoneImages[headphoneType]}
          width={100}
          height={100}
          maxWidth={100}
          maxHeight={100}
          marginBottom={4}
        />

        <Text
          fontWeight="700"
          fontSize={25}
          color="darkGrey"
          textAlign="center"
          mb={16}
        >
          Please ensure you're wearing headphones.
        </Text>

        {connected == true && (
          <AntDesign
            name="checkcircle"
            size={80}
            color={palette.greenCorrect}
          />
        )}

        {connected == false && (
          <>
            <Entypo name="circle-with-cross" size={90} color={palette.red} />
            <Text variant="caption2" fontWeight="500" mt={8}>
              Plug in your headphones to continue.
            </Text>
          </>
        )}

        {connected && (
          <Box flex={1} justifyContent="flex-end" pb={6}>
            <Button variant="primary" label="Next" onPress={onNext} />
          </Box>
        )}
      </Box>
    </SafeAreaView>
  )
}
