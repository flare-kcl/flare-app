import { ScrollView } from 'react-native-gesture-handler'

import { Box, Button, Markdown } from '@components'

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
    <>
      <ScrollView
        scrollEventThrottle={16}
        contentInsetAdjustmentBehavior="automatic"
        style={{
          position: 'absolute',
          height: '100%',
        }}
      >
        {/* Terms and Condition Text */}
        <Box paddingHorizontal={4} paddingTop={10} paddingBottom={10}>
          <Markdown>
            {/* TODO: Will be swapped out for prop when we have example experiment! */}
            {terms}
          </Markdown>

          <Button
            testID="AcceptButton"
            label="I Accept T&C's"
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
    </>
  )
}
