import { Box, Text, Button, SafeAreaView } from '@components'
import { ThemeColors } from '@utils/theme'

type TextInstructionScreenProps = {
  heading: string
  description: string
  actionLabel?: string
  color?: string
  backgroundColor?: ThemeColors
  textColor?: ThemeColors
  linkColor?: ThemeColors
  textAlign?: string
  buttonDisabled?: boolean
  onNext: () => void
}

export const TextInstructionScreen: React.FunctionComponent<TextInstructionScreenProps> = ({
  heading,
  description,
  actionLabel,
  color = { s: 'purple' },
  textColor = 'darkGrey',
  backgroundColor = 'pureWhite',
  linkColor = 'pureWhite',
  textAlign = 'center',
  buttonDisabled = false,
  onNext,
}) => {
  return (
    <SafeAreaView flex={1} backgroundColor={backgroundColor}>
      <Box
        flex={1}
        alignItems="center"
        justifyContent="flex-start"
        backgroundColor={backgroundColor}
        px={6}
      >
        <Text variant="instructionHeading" mt={10} mb={5} color={textColor}>
          {heading}
        </Text>
        <Text
          variant="instructionDescription"
          mb={10}
          color={textColor}
          textAlign={textAlign}
        >
          {description}
        </Text>

        <Box flex={1} justifyContent="flex-end" pb={6}>
          {actionLabel && (
            <Text
              variant="caption2"
              px={6}
              mb={4}
              color={textColor}
              textAlign="center"
            >
              {actionLabel}
            </Text>
          )}

          <Button
            variant="primary"
            label="Next"
            backgroundColor={color}
            onPress={onNext}
            opacity={buttonDisabled ? 0.4 : 1}
            disabled={buttonDisabled}
            textProps={{
              color: linkColor,
            }}
          />
        </Box>
      </Box>
    </SafeAreaView>
  )
}
