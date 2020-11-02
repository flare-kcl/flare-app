import { Button } from 'react-native'
import { Box } from '@components'

export const DebugIndex = ({ navigation }) => {
  return (
    <Box paddingTop={10}>
      <Button
        testID="Tests.TestCacheScreen"
        title="Test Asset Cache"
        onPress={() => navigation.navigate('Tests.TestCacheScreen')}
      />
      <Button title="Exit" onPress={() => navigation.navigate('HomeScreen')} />
    </Box>
  )
}
