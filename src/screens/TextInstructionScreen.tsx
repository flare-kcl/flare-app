import { Box, Text, Button } from '@components'

type TextInstructionScreenProps = {
  heading: string
  description: string
  actionLabel?: string
  color?: string
  onNext: () => void
}

export const TextInstructionScreen: React.FunctionComponent<TextInstructionScreenProps> = ({
  heading,
  description,
  actionLabel,
  color = 'purple',
  onNext,
}) => {
  return (
    <Box
      flex={1}
      alignItems="center"
      justifyContent="flex-start"
      pt={24}
      px={5}
    >
      <Text variant="instructionHeading" mb={5}>
        {heading}
      </Text>
      <Text variant="instructionDescription" mb={10}>
        {description}
      </Text>
      {actionLabel && (
        <Text variant="instructionActionLabel" px={6}>
          {actionLabel}
        </Text>
      )}
      <Box flex={1} justifyContent="flex-end" pb={14}>
        <Button
          variant="primary"
          label="Next"
          backgroundColor={color}
          onPress={onNext}
        />
      </Box>
    </Box>
  )
}
