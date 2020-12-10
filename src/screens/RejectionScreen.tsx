import { Linking, ScrollView } from 'react-native'
import { Image, Box, Button, Text } from '@components'
import { RejectionReason } from '@redux/reducers'

type RejectionScreenParams = {
  reason: RejectionReason
  contactLink?: string
  onExit?: Function
}

const RejectionReasons = {
  TERMS_DECLINE: `Unfortunately, you will be unable to take part in this experiment because you did not accept the terms and conditions.`,
  INCORRECT_CRITERIA: `Unfortunately, some of the responses you gave on the previous screen mean that you are no longer able to take part in the experiment.`,
  TRIAL_TIMEOUT: `Unfortunately, you have left the app for too long during the experiment.`,
  TIMEOUT: `Unfortunately, your time to complete the experiment has expired.`,
  UNKNOWN: `Unfortunately, you are not an ideal candiate for this study.`,
}

export const RejectionScreen: React.FunctionComponent<RejectionScreenParams> = ({
  reason,
  contactLink,
  onExit,
}) => {
  // TODO: Swap to prop
  const reasonCopy = RejectionReasons[reason]

  return (
    <Box
      flex={1}
      flexDirection="column"
      alignItems="center"
      paddingTop={10}
      paddingHorizontal={4}
      backgroundColor="greenLight"
    >
      <Box
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
        paddingTop={10}
        width="100%"
      >
        <Image
          width="100%"
          height="100%"
          maxWidth={240}
          maxHeight={150}
          resizeMode="contain"
          opacity={0.8}
          source={require('../assets/images/fireworks.png')}
        />
      </Box>

      <Text variant="heading" mt={10}>
        Thank you for your interest in the FLARe app.
      </Text>

      <Text fontWeight="500" color="darkGrey" fontSize={15} mt={4}>
        {reasonCopy}
      </Text>

      <Box flex={1} flexDirection="column" justifyContent="flex-end" pb={10}>
        {contactLink && (
          <Button
            testID="ContinueButton"
            label="Contact Researcher"
            variant="primary"
            backgroundColor="coral"
            onPress={() => Linking.openURL(contactLink)}
          />
        )}
        <Button
          testID="ExitButton"
          label="Exit Experiment"
          variant="primary"
          onPress={() => onExit?.()}
        />
      </Box>
    </Box>
  )
}
