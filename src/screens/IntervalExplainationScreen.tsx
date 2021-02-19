import { Box, Text, Button, Interval, ScrollView } from '@components'

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
      pt={{
        s: 8,
      }}
      px={6}
    >
      <Box height="25%" alignItems="center" justifyContent="center">
        <Interval />
      </Box>

      <Text variant="instructionDescription" mt={24}>
        {description}
      </Text>

      <Box flex={1} justifyContent="flex-end" mt={10} pb={6}>
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
