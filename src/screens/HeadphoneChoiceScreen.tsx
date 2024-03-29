import { Box, Button, Text, Pressable, Image, ScrollView } from '@components'

export type HeadphoneType = 'in_ear' | 'on_ear' | 'over_ear'

export type HeadphoneChoiceScreenProps = {
  headphoneType?: HeadphoneType
  updateHeadphoneType: (HeadphoneType) => void
  onNext: () => void
}

export const HeadphoneChoiceScreen: React.FunctionComponent<HeadphoneChoiceScreenProps> = ({
  headphoneType,
  updateHeadphoneType,
  onNext,
}) => {
  return (
    <ScrollView>
      <Box flex={1} pt={8} px={6}>
        <Text variant="heading">Select headphones</Text>
        <Text variant="heading3">
          Select the type of headphones you are using
        </Text>
        <HeadphoneButton
          active={headphoneType == 'in_ear'}
          label="In-ear"
          image={require('../assets/images/headphones/in-ear.jpg')}
          onPress={() => updateHeadphoneType('in_ear')}
        />
        <HeadphoneButton
          active={headphoneType == 'on_ear'}
          label="On-ear"
          image={require('../assets/images/headphones/on-ear.jpg')}
          onPress={() => updateHeadphoneType('on_ear')}
        />
        <HeadphoneButton
          active={headphoneType == 'over_ear'}
          label="Over-ear"
          image={require('../assets/images/headphones/over-ear.jpg')}
          onPress={() => updateHeadphoneType('over_ear')}
        />

        <Box flex={1} justifyContent="flex-end" pb={6}>
          <Button
            variant="primary"
            label="Next"
            marginTop={6}
            opacity={headphoneType != undefined ? 1 : 0.4}
            disabled={!headphoneType}
            onPress={onNext}
          />
        </Box>
      </Box>
    </ScrollView>
  )
}

const HeadphoneButton = ({ active, image, label, onPress }) => {
  return (
    <Pressable
      flexDirection="row"
      paddingLeft={2}
      marginTop={4}
      height={80}
      width="100%"
      backgroundColor={active ? 'purple' : 'purpleLight'}
      borderRadius="m"
      alignItems="center"
      onPress={onPress}
    >
      <Box
        borderRadius="s"
        backgroundColor="white"
        height={60}
        width={60}
        alignItems="center"
        justifyContent="center"
      >
        <Image
          source={image}
          style={{ width: 54, height: 54 }}
          resizeMode="contain"
        />
      </Box>
      <Text
        fontSize={16}
        pl={6}
        color={active ? 'white' : 'purple'}
        fontFamily="Inter-SemiBold"
      >
        {label}
      </Text>
    </Pressable>
  )
}
