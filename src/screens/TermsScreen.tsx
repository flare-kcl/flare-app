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
      {/* Terms and Condition Text */}
      <Box flex={1} pt={10} px={6}>
        <Box>
          <Markdown mb={4}>{terms}</Markdown>
        </Box>

        <Box flex={1} justifyContent="flex-end" pb={6}>
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
