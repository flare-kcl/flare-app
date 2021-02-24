import { Box, Button, Text, Pressable, Image, ScrollView } from '@components'
import { HeadphoneType } from '@containers/BasicInfoContainer'

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

        {headphoneType && (
          <Box flex={1} justifyContent="flex-end" pb={6}>
            <Button
              variant="primary"
              label="Next"
              marginTop={6}
              onPress={onNext}
            />
          </Box>
        )}
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
        <Image source={image} maxWidth={54} maxHeight={54} />
      </Box>
      <Text
        fontSize={16}
        pl={6}
        color={active ? 'white' : 'purple'}
        fontWeight="bold"
      >
        {label}
      </Text>
    </Pressable>
  )
}
