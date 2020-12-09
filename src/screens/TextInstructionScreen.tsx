import { Box, Text, Button, SafeAreaView } from '@components'
import { palette } from '@utils/theme'

type TextInstructionScreenProps = {
  heading: string
  description: string
  actionLabel?: string
  color?: string
  backgroundColor?: string
  textColor?: string
  linkColor?: string
  textAlign?: string
  onNext: () => void
}

export const TextInstructionScreen: React.FunctionComponent<TextInstructionScreenProps> = ({
  heading,
  description,
  actionLabel,
  color = 'purple',
  textColor = 'darkGrey',
  backgroundColor = 'white',
  linkColor = 'white',
  textAlign = 'center',
  onNext,
}) => {
  return (
    <SafeAreaView flex={1} backgroundColor={backgroundColor}>
      <Box
        flex={1}
        alignItems="center"
        justifyContent="flex-start"
        backgroundColor={backgroundColor}
        pt={10}
        px={5}
      >
        <Text variant="instructionHeading" mb={5} color={textColor}>
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
        {actionLabel && (
          <Text variant="instructionActionLabel" px={6} color={textColor}>
            {actionLabel}
          </Text>
        )}
        <Box flex={1} justifyContent="flex-end" pb={4}>
          <Button
            variant="primary"
            label="Next"
            backgroundColor={color}
            onPress={onNext}
            textProps={{
              color: linkColor,
            }}
          />
        </Box>
      </Box>
    </SafeAreaView>
  )
}
