import { Box, Text, Button, Markdown, ScrollView } from '@components'

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
    <ScrollView>
      <Box
        flex={1}
        alignItems="center"
        justifyContent="flex-start"
        pt={{ s: 8, m: 12 }}
        px={5}
      >
        {heading && (
          <Text variant="instructionHeading" mb={10}>
            {heading}
          </Text>
        )}

        <Markdown mb={16} textAlign="left">
          {description}
        </Markdown>

        <Text variant="caption2" fontFamily="Inter-SemiBold" pb={2}>
          Time Left:
        </Text>

        {timerText && (
          <Text fontFamily="Inter-ExtraBold" textAlign="center" fontSize={45}>
            {timerText}
          </Text>
        )}

        {extendedTimerText && (
          <Text fontFamily="Inter-ExtraBold" textAlign="center" fontSize={20}>
            {extendedTimerText}
          </Text>
        )}

        {eta && (
          <>
            <Text variant="caption2" fontSize={12} pt={10}>
              Break will end at:
            </Text>
            <Text variant="caption2" fontFamily="Inter-SemiBold" pt={4}>
              {eta}
            </Text>
          </>
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
    </ScrollView>
  )
}
