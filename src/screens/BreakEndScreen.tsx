import { ScrollView } from 'react-native'
import { Box, Text, Button, Markdown, SafeAreaView } from '@components'

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
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <SafeAreaView flex={1}>
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

          <Text variant="caption2" fontWeight="600" pb={2}>
            Time Left:
          </Text>

          {timerText && (
            <Text fontWeight="800" textAlign="center" fontSize={45}>
              {timerText}
            </Text>
          )}

          {extendedTimerText && (
            <Text fontWeight="800" textAlign="center" fontSize={20}>
              {extendedTimerText}
            </Text>
          )}

          {eta && (
            <>
              <Text variant="caption2" fontSize={12} pt={10}>
                Break will end at:
              </Text>
              <Text variant="caption2" fontWeight="600" pt={4}>
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
      </SafeAreaView>
    </ScrollView>
  )
}
