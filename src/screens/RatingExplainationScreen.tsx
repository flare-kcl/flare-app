import { Box, Text, Button, RatingScale, SafeAreaView } from '@components'

type RatingExplainationScreenProps = {
  heading: string
  description: string
  actionLabel?: string
  color?: string
  onNext: () => void
}

export const RatingExplainationScreen: React.FunctionComponent<RatingExplainationScreenProps> = ({
  heading,
  description,
  actionLabel,
  color = 'purple',
  onNext,
}) => {
  return (
    <SafeAreaView flex={1}>
      <Box
        flex={1}
        alignItems="center"
        justifyContent="flex-start"
        pt={24}
        px={1}
      >
        <Text
          variant="instructionDescription"
          mb={10}
          px={5}
          textAlign="center"
        >
          {heading}
        </Text>

        <RatingScale disabled />

        <Text
          variant="instructionDescription"
          mb={10}
          px={5}
          textAlign="center"
        >
          {description}
        </Text>

        {actionLabel && (
          <Text variant="instructionActionLabel" px={6}>
            {actionLabel}
          </Text>
        )}

        <Box flex={1} justifyContent="flex-end" pb={6} px={5}>
          <Button
            variant="primary"
            label="Next"
            backgroundColor={color}
            onPress={onNext}
          />
        </Box>
      </Box>
    </SafeAreaView>
  )
}
