import { Dimensions, ImageSourcePropType } from 'react-native'
import { Image, Box } from '@components'

type TrialImageStackProps = {
  contextImage: ImageSourcePropType
  stimulusImage: ImageSourcePropType
}

export const TrialImageStack: React.FunctionComponent<TrialImageStackProps> = ({
  contextImage,
  stimulusImage,
}) => {
  const screenWidth = Dimensions.get('window').width
  const imageSizing = {
    width: '100%',
    height: '100%',
    maxWidth: screenWidth * 0.8,
    maxHeight: screenWidth * 0.8,
    resizeMode: 'center',
  }

  return (
    <Box
      flex={1}
      position="relative"
      alignItems="center"
      justifyContent="center"
    >
      {/* Context Image */}
      <Image {...imageSizing} source={contextImage} />

      {/* Stimulus Image */}
      <Image {...imageSizing} position="absolute" source={stimulusImage} />
    </Box>
  )
}
