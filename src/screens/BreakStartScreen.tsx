import { ScrollView } from 'react-native'
import { Box, Text, Button, Markdown, SafeAreaView } from '@components'

type BreakStartScreenProps = {
  heading: string
  description: string

  buttonDisabled?: boolean
  actionLabel: string
  onNext: () => void
}

export const BreakStartScreen: React.FunctionComponent<BreakStartScreenProps> = ({
  heading,
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

          <Markdown mb={16}>{description}</Markdown>

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
