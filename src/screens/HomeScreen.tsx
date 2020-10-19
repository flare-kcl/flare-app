import React from 'react'
import { View } from 'react-native'

import { Box, Text } from '@components'

export const HomeScreen = () => (
  <Box
    flex={1}
    flexDirection={{
      phone: 'column',
    }}
    backgroundColor="mainBackground"
    paddingVertical="xl"
    paddingHorizontal="m"
  >
    <Text variant="heading">Welcome to FLARe App!</Text>
  </Box>
)
