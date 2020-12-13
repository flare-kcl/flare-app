import { Linking } from 'react-native'
import { Image, Box, Button, Text, SafeAreaView } from '@components'
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
    <SafeAreaView flex={1} backgroundColor="greenPrimary">
      <Box
        flex={1}
        flexDirection="column"
        alignItems="center"
        pt={10}
        px={6}
        backgroundColor="greenPrimary"
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

        <Text variant="heading" mt={24}>
          Thank you for your interest in the FLARe app.
        </Text>

        <Text fontWeight="500" color="darkGrey" fontSize={18} mt={6} p={0}>
          {reasonCopy}
        </Text>

        <Box flex={1} flexDirection="column" justifyContent="flex-end" pb={6}>
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
    </SafeAreaView>
  )
}
