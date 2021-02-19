import { useState } from 'react'
import { Box, Text, Button, RatingScale } from '@components'
import { AnchorLabels } from '@containers/ExperimentContainer'

type RatingPracticeScreenProps = {
  heading: string
  color?: string
  anchorLabels: AnchorLabels
  onNext: () => void
}

export const RatingPracticeScreen: React.FunctionComponent<RatingPracticeScreenProps> = ({
  heading,
  color = 'purple',
  anchorLabels,
  onNext,
}) => {
  const [showButton, setShowButton] = useState(false)

  return (
    <Box
      flex={1}
      alignItems="center"
      justifyContent="flex-start"
      pt={{
        s: 8,
        m: 12,
      }}
      px={1}
    >
      <Text variant="instructionDescription" mb={10} px={5} textAlign="center">
        {heading}
      </Text>

      <RatingScale
        {...anchorLabels}
        lockFirstRating
        onChange={() => {
          setShowButton(true)
        }}
      />

      {showButton && (
        <Box flex={1} justifyContent="flex-end" pb={6} px={5}>
          <Text variant="caption2" textAlign="center" pb={4}>
            Notice how you cannot change your rating once it has been made.
          </Text>
          <Button
            variant="primary"
            label="Next"
            backgroundColor={color}
            onPress={onNext}
          />
        </Box>
      )}
    </Box>
  )
}
