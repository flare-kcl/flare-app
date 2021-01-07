import { ExperimentModule } from './ExperimentContainer'
import { AffectiveRatingScreen } from '@screens'
import { ImageSourcePropType } from 'react-native'

export type AffectiveRatingModuleDefinition = {
  stimulus: string
  question: string
  ratingScaleAnchorLabelLeft: string
  ratingScaleAnchorLabelCenter: string
  ratingScaleAnchorLabelRight: string
}

export type AffectiveRatingModuleState = AffectiveRatingModuleDefinition & {
  rating?: number
}

export const AffectiveRatingContainer: ExperimentModule<AffectiveRatingModuleState> = ({
  experiment,
  module: mod,
  onModuleComplete,
}) => {
  const stimulusImage: ImageSourcePropType =
    mod.stimulus === 'csa' || mod.stimulus === 'csb'
      ? experiment.definition.conditionalStimuli.find(
          (cs) => cs.label == mod.stimulus,
        )?.image
      : experiment.definition.generalisationStimuli.find(
          (gs) => gs.label == mod.stimulus,
        )?.image

  function onRatingComplete(rating: number) {
    // Save rating response & Mark module finished
    onModuleComplete({ rating })
  }

  return (
    <AffectiveRatingScreen
      question={mod.question}
      stimulus={mod.stimulus}
      stimulusImage={stimulusImage}
      ratingScaleAnchorLabelCenter={mod.ratingScaleAnchorLabelCenter}
      ratingScaleAnchorLabelLeft={mod.ratingScaleAnchorLabelLeft}
      ratingScaleAnchorLabelRight={mod.ratingScaleAnchorLabelRight}
      onNext={onRatingComplete}
    />
  )
}
