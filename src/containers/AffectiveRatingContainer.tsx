import { ExperimentModule, VisualStimuli } from './ExperimentContainer'
import { AffectiveRatingScreen } from '@screens'
import { generateTrials, Trial } from '@containers/FearConditioningContainer'
import { useEffect } from 'react'

export type AffectiveRatingModuleDefinition = {
  question: string
  generalisationStimuliEnabled: boolean
  ratingScaleAnchorLabelLeft: string
  ratingScaleAnchorLabelCenter: string
  ratingScaleAnchorLabelRight: string
}

export type AffectiveRatingModuleState = AffectiveRatingModuleDefinition & {
  stimuli?: Trial[]
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
        stimuli: generateTrials(
          1,
          0,
          experiment.definition.conditionalStimuli['cs+'],
          experiment.definition.conditionalStimuli['cs-'],
          experiment.definition.generalisationStimuli,
        ),
      })
    }
  }, [])

  // If no stimuli then halt...
  if (mod.stimuli === undefined) return null

  // Get the current stimuli
  const stimulus = mod.stimuli[mod.currentStimuliIndex]
  function onRatingComplete(rating: number) {
    // Update array with response
    const updatedStimuli = mod.stimuli.map((stimuli, index) => {
      if (index === mod.currentStimuliIndex) {
        return {
          ...stimuli,
          response: {
            rating,
          },
        } as Trial
      }

      return stimuli
    })

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
      stimulusImage={stimulus.stimulusImage}
      ratingScaleAnchorLabelCenter={mod.ratingScaleAnchorLabelCenter}
      ratingScaleAnchorLabelLeft={mod.ratingScaleAnchorLabelLeft}
      ratingScaleAnchorLabelRight={mod.ratingScaleAnchorLabelRight}
      onNext={onRatingComplete}
    />
  )
}
