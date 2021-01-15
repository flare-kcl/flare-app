import { Box, Text, Button, SafeAreaView } from '@components'

type BreakEndScreenProps = {
  heading: string
  description: string
  timerText: string
  eta: string
  extendedTimerText: string
  buttonDisabled: boolean
  actionLabel: string
  onNext: () => void
}

export const BreakEndScreen: React.FunctionComponent<BreakEndScreenProps> = ({
  eta,
  heading,
  timerText,
  extendedTimerText,
  description,
  actionLabel,
  buttonDisabled = false,
  onNext,
}) => {

  return (
    <SafeAreaView flex={1}>
      <Box
        flex={1}
        alignItems="center"
        justifyContent="flex-start"
        pt={{ s: 8, m: 12 }}
        px={5}
      >
        <Text variant="instructionHeading" mb={10}>
          {heading}
        </Text>

        <Text variant="instructionDescription" mb={16} textAlign='left'>
          {description}
        </Text>

        <Text variant="caption2" fontWeight='600' pb={2}>
          Time Left:
        </Text>

        {timerText && (
          <Text fontWeight='800' textAlign='center' fontSize={45}>
            {timerText}
          </Text>
        )}

        {extendedTimerText && (
          <Text fontWeight='800' textAlign='center' fontSize={20}>
            {extendedTimerText}
          </Text>
        )}

        {eta && (
          <Text variant="caption2" fontWeight='600' pt={10}>
            ETA: {eta}
          </Text>
        )}

        <Box flex={1} justifyContent="flex-end" pb={6}>
          <Text variant="caption2" px={4} mb={3} textAlign="center">
            {actionLabel}
          </Text>

          <Button
            variant="primary"
            label="Next"
            onPress={onNext}
            opacity={buttonDisabled ? 0.4 : 1}
            disabled={buttonDisabled}
          />
        </Box>
      </Box>
    </SafeAreaView>
  )
}
