import { ExperimentModule, VisualStimuli } from './ExperimentContainer'
import { AffectiveRatingScreen } from '@screens'
import { shuffle } from 'lodash'
import { useEffect } from 'react'

export type AffectiveRatingResponse = VisualStimuli & {
  rating?: number
}

export type AffectiveRatingModuleDefinition = {
  question: string
  generalisationStimuliEnabled: boolean
  ratingScaleAnchorLabelLeft: string
  ratingScaleAnchorLabelCenter: string
  ratingScaleAnchorLabelRight: string
}

export type AffectiveRatingModuleState = AffectiveRatingModuleDefinition & {
  stimuli?: AffectiveRatingResponse[]
  currentStimuliIndex?: number
}

export const AffectiveRatingContainer: ExperimentModule<AffectiveRatingModuleState> = ({
  experiment,
  module: mod,
  updateModule,
  onModuleComplete,
}) => {
  useEffect(() => {
    if (mod.stimuli === undefined) {
      updateModule({
        currentStimuliIndex: 0,
        stimuli: shuffle(
          mod.generalisationStimuliEnabled
            ? [
                ...experiment.definition.conditionalStimuli,
                ...experiment.definition.generalisationStimuli,
              ]
            : experiment.definition.conditionalStimuli,
        ),
      })
    }
  }, [])

  // If no stimuli then halt...
  if (mod.stimuli === undefined) return null

  // Get the current stimuli
  const stimulus: AffectiveRatingResponse = mod.stimuli[mod.currentStimuliIndex]

  function onRatingComplete(rating: number) {
    // Update array with response
    const updatedStimuli = mod.stimuli.map(
      (stimuli: AffectiveRatingResponse, index) => {
        if (index === mod.currentStimuliIndex) {
          return {
            ...stimuli,
            rating,
          }
        }

        return stimuli
      },
    )

    // Increment until the end of stimuli
    if (mod.currentStimuliIndex === mod.stimuli.length - 1) {
      // Save rating response & Mark module finished
      onModuleComplete({ stimuli: updatedStimuli })
    } else {
      // Save rating response
      updateModule({
        stimuli: updatedStimuli,
        currentStimuliIndex: mod.currentStimuliIndex + 1,
      })
    }
  }

  return (
    <AffectiveRatingScreen
      key={`af-trial-${stimulus.label}`}
      question={mod.question}
      stimulusImage={stimulus.image}
      ratingScaleAnchorLabelCenter={mod.ratingScaleAnchorLabelCenter}
      ratingScaleAnchorLabelLeft={mod.ratingScaleAnchorLabelLeft}
      ratingScaleAnchorLabelRight={mod.ratingScaleAnchorLabelRight}
      onNext={onRatingComplete}
    />
  )
}
