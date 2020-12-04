import { useState } from 'react'
import { Box, Text, Button, Image } from '@components'
import { useEffect } from 'react'
import AudioSensor from '@utils/AudioSensor'
import { Entypo, AntDesign } from '@expo/vector-icons'
import { useRef } from 'react'
import { EmitterSubscription } from 'react-native'
import { palette } from '@utils/theme'

type HeadphonesDetectionScreenProps = {
  headphoneType: string
  onNext: () => void
}

const HeadphoneImages = {
  ON_EAR: require('../assets/images/headphones/on-ear.jpg'),
  IN_EAR: require('../assets/images/headphones/in-ear.jpg'),
  OVER_EAR: require('../assets/images/headphones/over-ear.jpg'),
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
        mb={10}
      >
        Please ensure you're wearing headphones.
      </Text>

      {connected == true && (
        <AntDesign name="checkcircle" size={80} color={palette.greenCorrect} />
      )}

      {connected == false && (
        <Entypo name="circle-with-cross" size={90} color={palette.red} />
      )}

      {connected && (
        <Box flex={1} justifyContent="flex-end" pb={14}>
          <Button variant="primary" label="Next" onPress={onNext} />
        </Box>
      )}
    </Box>
  )
}
