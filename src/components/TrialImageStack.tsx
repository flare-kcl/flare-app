import { Dimensions, ImageSourcePropType } from 'react-native'
import { Image, Box } from '@components'

type TrialImageStackProps = {
  contextImage: ImageSourcePropType
  stimulusImage: ImageSourcePropType
}

// A base context image is sused to scale the stimulus
const BASE_IMAGE_SIZE = 800

export const TrialImageStack: React.FunctionComponent<TrialImageStackProps> = ({
  contextImage,
  stimulusImage,
}) => {
  const screenWidth = Dimensions.get('window').width
  const imageSize = screenWidth * 0.8
  const imageToScreenRatio = (imageSize / BASE_IMAGE_SIZE) * 100
  const imageSizingProps = {
    width: '100%',
    height: '100%',
    maxWidth: imageSize,
    maxHeight: imageSize,
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
      <Image {...imageSizingProps} source={contextImage} />

      {/* Stimulus Image */}
      <Image
        position="absolute"
        height="100%"
        width="100%"
        maxWidth={`${imageToScreenRatio}%`}
        maxHeight={`${imageToScreenRatio}%`}
        source={stimulusImage}
      />
    </Box>
  )
}
