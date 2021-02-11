import { useState } from 'react'
import {
  Box,
  Text,
  Button,
  ScrollView,
  SafeAreaView,
  RatingScale,
  TrialImageStack,
} from '@components'
import { ImageSourcePropType } from 'react-native'

export type AffectiveRatingScreenProps = {
  question: string
  ratingScaleAnchorLabelLeft: string
  ratingScaleAnchorLabelCenter: string
  ratingScaleAnchorLabelRight: string
  stimulusImage: ImageSourcePropType
  onNext?: (rating: number) => void
}

export const AffectiveRatingScreen: React.FunctionComponent<AffectiveRatingScreenProps> = ({
  question,
  stimulusImage,
  ratingScaleAnchorLabelLeft,
  ratingScaleAnchorLabelCenter,
  ratingScaleAnchorLabelRight,
  onNext,
}) => {
  const [rating, setRating] = useState<number>()

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <SafeAreaView flex={1}>
        <Box flex={1} px={1} pt={4} alignItems="center">
          <TrialImageStack stimulusImage={stimulusImage} />
          <Text
            variant="heading2"
            mt={{
              s: 4,
              m: 12,
            }}
            mb={{
              s: 8,
              m: 14,
            }}
            px={2}
            textAlign="center"
          >
            {question}
          </Text>
          <RatingScale
            lockFirstRating={false}
            anchorLabelCenter={ratingScaleAnchorLabelCenter}
            anchorLabelLeft={ratingScaleAnchorLabelLeft}
            anchorLabelRight={ratingScaleAnchorLabelRight}
            onChange={setRating}
            paddingBottom={{
              s: 4,
              m: 16,
            }}
            minAnchorHeight={10}
          />

          <Box flex={1} justifyContent="flex-end" px={5} pb={4}>
            <Button
              variant="primary"
              label="Next"
              opacity={rating === undefined ? 0 : 1}
              disabled={rating === undefined}
              onPress={() => {
                onNext(rating)
              }}
            />
          </Box>
        </Box>
      </SafeAreaView>
    </ScrollView>
  )
}
