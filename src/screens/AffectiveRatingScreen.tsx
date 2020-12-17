import { useState } from 'react'
import {
  Box,
  Image,
  Text,
  Button,
  SafeAreaView,
  RatingScale,
  TrialImageStack,
} from '@components'
import { AffectiveRatingModuleDefinition } from '@containers/AffectiveRatingContainer'

export type AffectiveRatingScreenProps = AffectiveRatingModuleDefinition & {
  onNext?: (rating: number) => void
}

export const AffectiveRatingScreen: React.FunctionComponent<AffectiveRatingScreenProps> = ({
  stimuli,
  heading,
  ratingScaleAnchorLabelLeft,
  ratingScaleAnchorLabelCenter,
  ratingScaleAnchorLabelRight,
  onNext,
}) => {
  const [rating, setRating] = useState<number>()

  return (
    <SafeAreaView flex={1}>
      <Box flex={1} px={1} pt={10} alignItems="center">
        <TrialImageStack stimulusImage={stimuli} />
        <Text variant="heading2" mt={14} mb={24} px={2} textAlign="center">
          {heading}
        </Text>
        <RatingScale
          lockFirstRating={false}
          anchorLabelCenter={ratingScaleAnchorLabelCenter}
          anchorLabelLeft={ratingScaleAnchorLabelLeft}
          anchorLabelRight={ratingScaleAnchorLabelRight}
          onChange={setRating}
        />

        <Box flex={1} justifyContent="flex-end" px={5} pb={4}>
          {rating !== undefined && (
            <Button
              variant="primary"
              label="Next"
              onPress={() => {
                onNext(rating)
              }}
            />
          )}
        </Box>
      </Box>
    </SafeAreaView>
  )
}
