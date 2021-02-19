import { ScrollView } from 'react-native-gesture-handler'

import { Box, Button, Markdown, SafeAreaView } from '@components'

export type TermsScreenParams = {
  terms: string
  onAccept?: Function
  onExit?: Function
}

export const TermsScreen: React.FunctionComponent<TermsScreenParams> = ({
  terms,
  onAccept,
  onExit,
}) => {
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{
        position: 'absolute',
        height: '100%',
      }}
    >
      {/* Terms and Condition Text */}
      <Box pt={10} px={6} pb={6}>
        <Markdown mb={4}>{terms}</Markdown>
        <Button
          testID="AcceptButton"
          label="I Accept T&Cs"
          variant="primary"
          onPress={() => onAccept()}
        />
        <Button
          testID="ExitButton"
          label="Decline and Exit"
          variant="exit"
          onPress={() => onExit()}
        />
      </Box>
    </ScrollView>
  )
}
