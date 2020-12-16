import { ExperimentModule } from './ExperimentContainer'
import { AffectiveRatingScreen } from '@screens'
import { ImageSourcePropType } from 'react-native'

export type AffectiveRatingModuleDefinition = {
  stimuli: ImageSourcePropType
  heading: string
  ratingScaleAnchorLabelLeft: string
  ratingScaleAnchorLabelCenter: string
  ratingScaleAnchorLabelRight: string
}

type AffectiveRatingModuleState = AffectiveRatingModuleDefinition & {
  rating?: string
}

export const AffectiveRatingContainer: ExperimentModule<AffectiveRatingModuleState> = ({
  module: mod,
  updateModule,
  onModuleComplete,
  exitExperiment,
}) => {
  function onRatingComplete(rating: number) {
    // Save rating response
    updateModule({ rating })
    // Mark module finished
    onModuleComplete()
  }

  return (
    <AffectiveRatingScreen
      heading={mod.heading}
      stimuli={mod.stimuli}
      ratingScaleAnchorLabelCenter={mod.ratingScaleAnchorLabelCenter}
      ratingScaleAnchorLabelLeft={mod.ratingScaleAnchorLabelLeft}
      ratingScaleAnchorLabelRight={mod.ratingScaleAnchorLabelRight}
      onNext={onRatingComplete}
    />
  )
}
