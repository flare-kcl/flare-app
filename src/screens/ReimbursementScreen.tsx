import Clipboard from '@react-native-community/clipboard'
import {
  ScrollView,
  SafeAreaView,
  Box,
  Markdown,
  Text,
  Button,
} from '@components'

export const ReimbursementScreen = ({ body, code, onExit }) => {
  return (
    <ScrollView backgroundColor="greenLight">
      <Box flex={1} pt={10} px={6}>
        <Markdown>{body}</Markdown>

        <Box
          backgroundColor="greenLight"
          mt={10}
          paddingVertical={5}
          borderRadius="m"
          borderWidth={4}
          borderColor="purple"
        >
          <Text
            textAlign="center"
            fontSize={18}
            fontFamily="Inter-SemiBold"
            selectable
          >
            {code}
          </Text>
        </Box>

        <Box
          flex={1}
          height="100%"
          flexDirection="column"
          justifyContent="flex-end"
          mt={6}
          pb={6}
        >
          <Button
            testID="CopyButton"
            label="Copy Code"
            variant="primary"
            backgroundColor="coral"
            onPress={() => Clipboard.setString(code)}
          />
          <Button
            testID="ExitButton"
            label="Exit Experiment"
            variant="primary"
            onPress={() => onExit()}
          />
        </Box>
      </Box>
    </ScrollView>
  )
}
