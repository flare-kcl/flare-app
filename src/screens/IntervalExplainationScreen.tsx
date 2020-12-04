import { Box, Text, Button, Interval } from '@components'

type IntervalExplainationScreenProps = {
  description: string
  color?: string
  onNext: () => void
}

export const IntervalExplainationScreen: React.FunctionComponent<IntervalExplainationScreenProps> = ({
  description,
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
      <Interval />

      <Text variant="instructionDescription" mt={24} mb={10} pt={24}>
        {description}
      </Text>

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
