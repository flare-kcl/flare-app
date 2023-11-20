import { Dimensions } from 'react-native'
import { Box } from './Box'
import { Text } from './Text'

export const Interval = () => {
  const screenWidth = Dimensions.get('window').width
  const imageSize = screenWidth * 0.8
  return (
    <Box
      flex={1}
      width={screenWidth}
      pt={8}
      alignItems="center"
      justifyContent="center"
      style={{ marginTop: -10 }}
    >
      <Box
        flex={1}
        width={imageSize}
        height={imageSize}
        justifyContent="center"
        alignItems="center"
      >
        <Text fontFamily="Inter-SemiBold" fontSize={120}>
          +
        </Text>
      </Box>
    </Box>
  )
}
