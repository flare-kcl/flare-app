import { Box } from './Box'
import { Text } from './Text'

export const NetworkError = () => (
  <Box
    flexDirection="row"
    justifyContent="space-between"
    alignItems="center"
    mb={4}
    p={4}
    backgroundColor="white"
    borderColor="red"
    borderWidth={4}
    borderRadius="m"
  >
    <Text variant="heading3" fontFamily="Inter-SemiBold" color="darkGrey">
      You do not have internet access, Please come back when you have a stable
      connection.
    </Text>
  </Box>
)
