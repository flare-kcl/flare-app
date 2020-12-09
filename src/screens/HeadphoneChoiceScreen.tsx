import { ScrollView } from 'react-native-gesture-handler'
import { Box, Button, Text, Pressable, Image } from '@components'
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
    <>
      <Box flex={1} pt={24} px={4} pb={4}>
        <Text variant="heading">Select headphones</Text>
        <Text variant="heading3">
          Select the type of headphones you are using
        </Text>
        <HeadphoneButton
          active={headphoneType == 'IN_EAR'}
          label="In-ear"
          image={require('../assets/images/headphones/in-ear.jpg')}
          onPress={() => updateHeadphoneType('IN_EAR')}
        />
        <HeadphoneButton
          active={headphoneType == 'ON_EAR'}
          label="On-ear"
          image={require('../assets/images/headphones/on-ear.jpg')}
          onPress={() => updateHeadphoneType('ON_EAR')}
        />
        <HeadphoneButton
          active={headphoneType == 'OVER_EAR'}
          label="Over-ear"
          image={require('../assets/images/headphones/over-ear.jpg')}
          onPress={() => updateHeadphoneType('OVER_EAR')}
        />

        {headphoneType && (
          <Box flex={1} justifyContent="flex-end" pb={14}>
            <Button
              variant="primary"
              label="Next"
              marginTop={10}
              onPress={onNext}
            />
          </Box>
        )}
      </Box>
    </>
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
        backgroundColor="pureWhite"
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
