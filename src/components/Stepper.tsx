import { Box, Text } from '.'

export const Stepper = ({
  stageLabel,
  currentStep,
  numberOfSteps,
  color = 'purple',
}) => {
  return (
    <Box paddingTop={5} backgroundColor="white">
      {/* Top Dots */}
      <Box flexDirection="row" alignItems="center" justifyContent="center">
        {new Array(numberOfSteps).fill(0).map((_, index) => (
          <Box
            key={`stepper-item-${index}`}
            position="relative"
            height={14}
            width={14}
            borderRadius="round"
            backgroundColor={index <= currentStep ? color : 'black'}
            opacity={index <= currentStep ? 1 : 0.2}
            marginLeft={1}
            marginRight={1}
          />
        ))}
      </Box>

      {/* Description Label */}
      <Box alignItems="center" marginTop={5}>
        <Text fontSize={16}>
          <Text fontWeight="bold">{stageLabel}: </Text>
          Step {currentStep + 1} of {numberOfSteps}
        </Text>
      </Box>
    </Box>
  )
}
