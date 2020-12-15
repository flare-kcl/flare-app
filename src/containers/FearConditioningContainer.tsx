import { useEffect, useCallback, useState } from 'react'
import { shuffle } from 'lodash'
import { ExperimentModule } from './ExperimentContainer'
import {
  FearConditioningTrialScreen,
  FearConditioningTrialResponse,
} from '@screens'
import { useAlert } from '@utils/AlertProvider'

export type FearConditioningModuleState = {
  phase: string
  trialsPerStimulus: number
  reinforcementRate: number
  generalisationStimuliEnabled: boolean
  stimuli: [{ label: string; image: any }]
  contextImage: any
  trials?: Trial[]
  currentTrialIndex: number
}

type Trial = {
  label: string
  stimulusImage: any
  reinforced: boolean
  response?: FearConditioningTrialResponse
}

export const FearConditioningContainer: ExperimentModule<FearConditioningModuleState> = ({
  experiment,
  module: mod,
  updateModule,
  exitExperiment,
  onModuleComplete,
}) => {
  const Alert = useAlert()
  const [lastTrialSkipped, setLastTrialSkipped] = useState(false)

  // Build the trials sequence on first render
  useEffect(() => {
    // Generate trials if they don't exist
    if (mod.trials === undefined) {
      updateModule({
        currentTrialIndex: 0,
        trials: generateTrials(
          mod.trialsPerStimulus,
          mod.reinforcementRate,
          // TODO: Remove Hardcoded Stimuli
          [
            { label: 'CSA', image: require('../assets/images/small.png') },
            { label: 'CSB', image: require('../assets/images/large.png') },
          ],
        ),
      })
    }

    // If we have finished trials then proceed on
    else if (mod.currentTrialIndex === mod.trials?.length) {
      onModuleComplete()
    }
  })

  const onTrialEnd = useCallback(
    (trialResponse: FearConditioningTrialResponse, checkIfSkipped = true) => {
      // Record if the response was skipped
      if (trialResponse.skipped) {
        // Warn user...
        if (lastTrialSkipped && checkIfSkipped) {
          Alert.alert(
            'Attention Required',
            'You have not been rating trials in the designated time, Please try to answer them as fast as you can.',
            [
              {
                label: 'Exit Experiment',
                onPress: () => exitExperiment(),
                style: 'cancel',
              },
              {
                label: 'Continue',
                onPress: () => {
                  // Continue with trials
                  if (experiment.rejectionReason === undefined) {
                    onTrialEnd(trialResponse, false)
                  }
                },
              },
            ],
          )
          return
        } else {
          // Set flag
          setLastTrialSkipped(true)
        }
      }

      // Update trials array with response
      const updatedTrials = mod.trials.map((trial, index) => {
        if (index === mod.currentTrialIndex) {
          return {
            ...trial,
            response: trialResponse,
          }
        }

        return trial
      })

      updateModule({
        currentTrialIndex: mod.currentTrialIndex + 1,
        trials: updatedTrials,
      })
    },
    [mod, lastTrialSkipped],
  )

  // Don't render until trials generated...
  if (
    mod.trials === undefined ||
    mod.currentTrialIndex === mod.trials?.length
  ) {
    return null
  }

  // Calculate a random trial interval length
  const intervalBounds = experiment.definition.intervalTimeBounds
  const trialDelay =
    (Math.floor(Math.random() * intervalBounds.max) + intervalBounds.min) * 1000

  // Render the current trial
  const currentTrial = mod.trials[mod.currentTrialIndex]
  return (
    currentTrial && (
      <FearConditioningTrialScreen
        key={`trial-${mod.currentTrialIndex}`}
        stimulusImage={currentTrial.stimulusImage}
        contextImage={require('../assets/images/example-context.jpg')}
        trialDelay={trialDelay}
        volume={experiment.volume}
        trialLength={experiment.definition.trialLength}
        ratingDelay={experiment.definition.ratingDelay}
        reinforced={currentTrial.reinforced}
        onTrialEnd={onTrialEnd}
        anchorLabelLeft={experiment.definition.ratingScaleAnchorLabelLeft}
        anchorLabelCenter={experiment.definition.ratingScaleAnchorLabelCenter}
        anchorLabelRight={experiment.definition.ratingScaleAnchorLabelRight}
      />
    )
  )
}

/**
 * Build a sequence of trials based on a set of rules
 *
 * @param experimentVC
 */
function generateTrials(
  trialsPerStimulus: number,
  reinforcementRate: number,
  stimuliDefs: any[],
): Trial[] {
  // Determine which image matches what stimulus
  let stimuli = shuffle(stimuliDefs)

  const positiveStimuli = stimuli[0]
  const negativeStimuli = stimuli[1]

  // Create equal amounts of trials
  let positiveStimuliTrials: Trial[] = []
  let negativeStimuliTrials: Trial[] = []
  for (var i = 0; i <= trialsPerStimulus; i++) {
    // Generate positive stimulus trial
    positiveStimuliTrials.push({
      label: positiveStimuli.label,
      stimulusImage: positiveStimuli.image,
      reinforced: i <= reinforcementRate,
    })

    // Generate negative stimulus trial
    negativeStimuliTrials.push({
      label: negativeStimuli.label,
      stimulusImage: negativeStimuli.image,
      reinforced: false,
    })
  }

  // Rule 1: First two trials must be one of each (in random order)
  // Rule 2: The first positive stimuli must be reinforced (hence the shift instead of pop)
  let trials = shuffle([
    positiveStimuliTrials.shift(),
    negativeStimuliTrials.shift(),
  ])

  // Shuffle sets to mix reinforced trials
  positiveStimuliTrials = shuffle(positiveStimuliTrials)
  negativeStimuliTrials = shuffle(negativeStimuliTrials)

  // Rule 3: Merge positive and negative stimuli with a maxiumum of 2 stimuli in consectutive order
  for (var i = 0; i < positiveStimuliTrials.length; i++) {
    // Get one of each stimuli & shuffle
    let tail = shuffle([
      positiveStimuliTrials.shift(),
      negativeStimuliTrials.shift(),
    ])
    // Append to end of our existing trials
    trials = trials.concat(tail)
  }

  // Return the generated trials.
  return trials
}
