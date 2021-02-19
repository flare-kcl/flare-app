import { Linking } from 'react-native'
import { Image, Box, Button, Text, ScrollView } from '@components'
import { RejectionReason } from '@redux/reducers'
import { palette } from '@utils/theme'

type RejectionScreenParams = {
  heading?: string
  body?: string
  reason: RejectionReason
  contactLink?: string
  onExit?: Function
}

const RejectionReasons = {
  TERMS_DECLINE: `Unfortunately, you will be unable to take part in this experiment because you did not accept the terms and conditions.`,
  INCORRECT_CRITERIA: `Unfortunately, some of the responses you gave on the previous screen mean that you are no longer able to take part in the experiment.`,
  TRIAL_TIMEOUT: `Unfortunately, you have left the app for too long during the experiment.`,
  TIMEOUT: `Unfortunately, your time to complete the experiment has expired.`,
  CORRUPT_ASSETS: `Unfortunately, we could not load the experiment correctly. Please contact your experiment administrator.`,
  VOUCHER_ERROR: `To receive your reimbursement voucher please use the contact button below.`,
  UNKNOWN: `Unfortunately, you are not an ideal candiate for this study.`,
}

export const RejectionScreen: React.FunctionComponent<RejectionScreenParams> = ({
  heading = 'Thank you for your interest in the FLARe app.',
  body,
  reason,
  contactLink,
  onExit,
}) => {
  const reasonCopy = body ?? RejectionReasons[reason]

  return (
    <ScrollView
      style={{
        backgroundColor: palette.greenPrimary,
      }}
    >
      <Box
        flex={1}
        flexDirection="column"
        alignItems="center"
        pt={{
          s: 2,
          m: 8,
        }}
        px={6}
      >
        <Box
          flexDirection="row"
          justifyContent="center"
          alignItems="center"
          width="100%"
        >
          <Image
            width="100%"
            height="100%"
            maxWidth={150}
            maxHeight={150}
            resizeMode="contain"
            opacity={0.8}
            source={require('../assets/images/fireworks.png')}
          />
        </Box>

        <Text variant="heading" mt={8}>
          {heading}
        </Text>

        <Box width="100%">
          <Text fontWeight="500" color="darkGrey" fontSize={18} mt={2} p={0}>
            {reasonCopy}
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
    </ScrollView>
  )
}
