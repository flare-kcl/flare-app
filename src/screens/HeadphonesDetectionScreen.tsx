import { useEffect, useRef, useState } from 'react'
import { AirplayButton, showRoutePicker } from 'react-airplay'
import { EmitterSubscription, Platform } from 'react-native'

import { Box, Button, Image, Pressable, Text } from '@components'
import { HeadphoneType } from '@screens/HeadphoneChoiceScreen'
import { AntDesign } from '@expo/vector-icons'
import AudioSensor from '@utils/AudioSensor'
import { palette } from '@utils/theme'

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

  const reCheckHeadphoneConnection = () => {
    AudioSensor.isHeadphonesConnected().then(setConnected)
  }

  useEffect(() => {
    AudioSensor.isHeadphonesConnected().then(setConnected)
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
              Connect your headphones to continue.
            </Text>
            {Platform.OS === 'ios' && (
              <>
                <Text
                  variant="caption2"
                  fontFamily="Inter"
                  mt={8}
                  mb={4}
                  textAlign="center"
                >
                  If you're using AirPods, please tap the button below and
                  select your AirPods.
                </Text>
                <Pressable
                  justifyContent="center"
                  backgroundColor={'darkGrey'}
                  height={48}
                  mt={2}
                  borderRadius={'m'}
                  onPress={() =>
                    showRoutePicker({ prioritizesVideoDevices: false })
                  }
                >
                  <Box px={4} flexDirection="row" alignItems="center">
                    <AirplayButton
                      prioritizesVideoDevices={false}
                      tintColor={palette.white}
                      activeTintColor={'blue'}
                      style={{
                        width: 24,
                        height: 24,
                      }}
                    />
                    <Text variant="buttonLabel" ml={2}>
                      Switch to AirPods
                    </Text>
                  </Box>
                </Pressable>
              </>
            )}
          </>
        )}
      </Box>

      <Box flex={1} alignSelf="flex-end" justifyContent="flex-end" pb={6}>
        <Button
          variant="primary"
          label="Re-check connection"
          onPress={reCheckHeadphoneConnection}
          disabled={connected}
          opacity={connected ? 0.4 : 1}
        />
        <Button
          variant="primary"
          label="Next"
          onPress={onNext}
          disabled={!connected}
          opacity={connected ? 1 : 0.4}
        />
      </Box>
    </Box>
  )
}
