import { Box, Text } from '@components'

export const HomeScreen = () => (
  <Box
    flex={1}
    flexDirection={{
      phone: 'column',
    }}
    backgroundColor="mainBackground"
    paddingVertical={10}
    paddingHorizontal={6}
  >
    <Text variant="heading">Welcome to FLARe App!</Text>
  </Box>
)
