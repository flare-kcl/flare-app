import { Dimensions, ImageSourcePropType } from 'react-native'
import { Box } from './Box'
import { Image } from './Image'

type TrialImageStackProps = {
  contextImage?: ImageSourcePropType
  stimulusImage?: ImageSourcePropType
}

export const TrialImageStack: React.FunctionComponent<TrialImageStackProps> = ({
  contextImage,
  stimulusImage,
}) => {
  const { width } = Dimensions.get('window')
  const imageSize = width > 640 ? width * 0.8 : width * 0.6
  const imageStyles = {
    position: 'absolute',
    width: imageSize,
    height: imageSize,
  }

  return (
    <Box
      flex={1}
      minHeight={imageSize}
      position="relative"
      alignItems="center"
      justifyContent="center"
    >
      {/* Context Image */}
      {contextImage && <Image style={imageStyles} source={contextImage} />}

      {/* Stimulus Image */}
      {stimulusImage && <Image source={stimulusImage} style={imageStyles} />}
    </Box>
  )
}
