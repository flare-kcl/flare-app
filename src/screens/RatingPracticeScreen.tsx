import { useState } from 'react'
import { Box, Text, Button, RatingScale } from '@components'

type RatingPracticeScreenProps = {
  heading: string
  color?: string
  onNext: () => void
}

export const RatingPracticeScreen: React.FunctionComponent<RatingPracticeScreenProps> = ({
  heading,
  color = 'purple',
  onNext,
}) => {
  const [showButton, setShowButton] = useState(false)

  return (
    <Box
      flex={1}
      alignItems="center"
      justifyContent="flex-start"
      pt={24}
      px={5}
    >
      <Text variant="instructionDescription" mb={10}>
        {heading}
      </Text>

      <RatingScale lockFirstRating onChange={() => setShowButton(true)} />

      {showButton && (
        <Box flex={1} justifyContent="flex-end" pb={14}>
          <Text textAlign="center" pb={8}>
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
