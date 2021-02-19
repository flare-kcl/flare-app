import { useState } from 'react'
import { Box, Text, Button, RatingScale, ScrollView } from '@components'
import { AnchorLabels } from '@containers/ExperimentContainer'

type RatingScreenProps = {
  heading: string
  value: number
  anchorLabels: AnchorLabels
  onChange: (value: number) => void
  onNext: () => void
}

export const RatingScreen: React.FunctionComponent<RatingScreenProps> = ({
  heading,
  value,
  anchorLabels,
  onChange,
  onNext,
}) => {
  return (
    <ScrollView>
      <Box
        flex={1}
        alignItems="center"
        justifyContent="flex-start"
        pt={{
          s: 8,
          m: 16,
        }}
        px={1}
      >
        <Text variant="heading" mb={16} px={5} textAlign="center">
          {heading}
        </Text>

        <RatingScale
          {...anchorLabels}
          value={value}
          lockFirstRating={false}
          ratingOptions={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
          onChange={(value) => {
            onChange(value)
          }}
        />

        {value !== undefined && (
          <Box flex={1} justifyContent="flex-end" pb={6} px={5}>
            <Button variant="primary" label="Next" onPress={onNext} />
          </Box>
        )}
      </Box>
    </ScrollView>
  )
}
