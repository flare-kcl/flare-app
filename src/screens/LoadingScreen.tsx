import Spinner from 'react-native-spinkit'
import { Box, NetworkError } from '@components'
import { palette } from '@utils/theme'

type LoadingScreenProps = {
  networkError?: boolean
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  networkError,
}) => (
  <Box
    flex={1}
    alignItems="center"
    justifyContent="center"
    backgroundColor="greenPrimary"
    pb={24}
  >
    <Spinner
      isVisible
      size={100}
      type="WanderingCubes"
      color={palette.purple}
    />

    {networkError && (
      <Box position="absolute" paddingHorizontal={4} bottom={100}>
        <NetworkError />
      </Box>
    )}
  </Box>
)
