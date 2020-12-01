import { useEffect } from 'react'
import { shuffle, update } from 'lodash'
import { Experiment } from '@containers/ExperimentContainer'
import {
  FearConditioningTrialScreen,
  FearConditioningTrialResponse,
} from '@screens'

type FearConditioningModuleState = {
  phase: string
  trialsPerStimulus: number
  reinforcementRate: number
  generalisationStimuliEnabled: boolean
  stimuliImages: any[]
  contextImage: any
  trials?: Trial[]
  currentTrialIndex: number
}

type ModuleContainerProps = {
  module: FearConditioningModuleState
  experiment: Experiment
  updateModule: (FearConditioningModuleState) => void
  onModuleComplete: () => void
  terminateExperiment: () => void
}

type Trial = {
  label: string
  stimulusImage: any
  reinforced: boolean
  response?: FearConditioningTrialResponse
}

export const FearConditioningContainer: React.FunctionComponent<ModuleContainerProps> = ({
  experiment,
  module: mod,
  updateModule,
  onModuleComplete,
}) => {
  // Build the trials sequence on first render
  useEffect(() => {
    if (mod.trials === undefined) {
      updateModule({
        currentTrialIndex: 0,
        trials: generateTrials(
          mod.trialsPerStimulus,
          mod.reinforcementRate,
          mod.stimuliImages,
        ),
      })
    }
  }, [])

  // Don't render until trials generated...
  if (mod.trials === undefined) {
    return null
  }

  function onTrialEnd(trialResponse) {
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

    // Iterate to next trial if ready, otherwise finish module
    if (mod.currentTrialIndex === mod.trials.length - 1) {
      // Update state with responses
      updateModule({
        trials: updatedTrials,
      })

      // Iterate to next module
      onModuleComplete()
    } else {
      updateModule({
        currentTrialIndex: mod.currentTrialIndex + 1,
        trials: updatedTrials,
      })
    }
  }

  // Calculate a random trial interval length
  const intervalBounds = experiment.intervalTimeBounds
  const trialDelay =
    Math.floor(Math.random() * intervalBounds.max) + intervalBounds.min

  // Render the current trial
  const currentTrial = mod.trials[mod.currentTrialIndex]
  return (
    currentTrial && (
      <FearConditioningTrialScreen
        key={`trial-${mod.currentTrialIndex}`}
        stimulusImage={currentTrial.stimulusImage}
        contextImage={require('../assets/images/example-context.jpg')}
        trialDelay={trialDelay}
        trialLength={experiment.trialLength}
        ratingDelay={experiment.ratingDelay}
        reinforced={currentTrial.reinforced}
        onTrialEnd={onTrialEnd}
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
  stimuliImages: any[],
): Trial[] {
  // Determine which image matches what stimulus
  let images = shuffle(stimuliImages)

  const positiveStimuliImage = images[0]
  const negativeStimuliImage = images[1]

  // Create equal amounts of trials
  let positiveStimuli: Trial[] = []
  let negativeStimuli: Trial[] = []
  for (var i = 0; i <= trialsPerStimulus; i++) {
    // Generate positive stimulus trial
    positiveStimuli.push({
      label: 'CS+',
      stimulusImage: positiveStimuliImage,
      reinforced: i < reinforcementRate,
    })

    // Generate negative stimulus trial
    negativeStimuli.push({
      label: 'CS-',
      stimulusImage: negativeStimuliImage,
      reinforced: false,
    })
  }

  // Rule 1: First two trials must be one of each (in random order)
  // Rule 2: The first positive stimuli must be reinforced (hence the shift instead of pop)
  let trials = shuffle([positiveStimuli.shift(), negativeStimuli.shift()])

  // Rule 3: Merge positive and negative stimuli with a maxiumum of 2 stimuli in consectutive order
  for (var i = 0; i < positiveStimuli.length; i++) {
    // Get one of each stimuli & shuffle
    let tail = shuffle([positiveStimuli.shift(), negativeStimuli.shift()])
    // Append to end of our existing trials
    trials = trials.concat(tail)
  }

  // Return the generated trials.
  return trials
}
