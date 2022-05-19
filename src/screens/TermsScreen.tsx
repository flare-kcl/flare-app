import { Box, Button, Markdown, ScrollView } from '@components'

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
    <ScrollView>
      <Box flex={1} pt={10} px={6}>
        {/* Terms and Condition Text */}
        <Markdown my={4} markdown={terms} borderRadius="m" overflow="hidden" />

        <Box justifyContent="flex-end" pb={6}>
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
      </Box>
    </ScrollView>
  )
}
