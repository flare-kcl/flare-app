import {
  Box,
  Text,
  Button,
  Interval,
  ScrollView,
  TrialImageStack,
} from '@components'

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
      <TrialImageStack stimulusImage={require('../assets/images/ITI.png')} />

      <Text variant="instructionDescription" mt={0}>
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
