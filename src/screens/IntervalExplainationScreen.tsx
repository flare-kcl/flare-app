import { Box, Text, Button, Interval, SafeAreaView } from '@components'

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
    <SafeAreaView flex={1}>
      <Box
        flex={1}
        alignItems="center"
        justifyContent="flex-start"
        pt={{
          s: 8,
        }}
        px={6}
      >
        <Box height="25%">
          <Interval />
        </Box>

        <Text variant="instructionDescription" mt={26} mb={10} pt={24}>
          {description}
        </Text>

        <Box flex={1} justifyContent="flex-end" pb={6}>
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
