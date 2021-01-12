import { useEffect, useCallback, useState, useRef } from 'react'
import { EmitterSubscription } from 'react-native'
import shuffle from 'lodash/shuffle'
import { ExperimentModule, VisualStimuli } from './ExperimentContainer'
import {
  FearConditioningTrialScreen,
  FearConditioningTrialResponse,
} from '@screens'
import { ToastRef } from '@components'
import { useAlert } from '@utils/AlertProvider'
import AudioSensor from '@utils/AudioSensor'

export type FearConditioningModuleState = {
  context: string
  phase: string
  trialsPerStimulus: number
  reinforcementRate: number
  generalisationStimuliEnabled: boolean
  conditionalStimuli: VisualStimuli[]
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
  const toastRef = useRef<ToastRef>()
  const volumeSensorListener = useRef<EmitterSubscription>()

  // Build the trials sequence on first render
  useEffect(() => {
    // Generate trials if they don't exist
    if (mod.trials === undefined) {
      updateModule({
        currentTrialIndex: 0,
        trials: generateTrials(
          mod.trialsPerStimulus,
          mod.reinforcementRate,
          experiment.definition.conditionalStimuli,
          mod.generalisationStimuliEnabled
            ? experiment.definition.generalisationStimuli
            : [],
        ),
      })
    }

    // If we have finished trials then proceed on
    else if (mod.currentTrialIndex === mod.trials?.length) {
      onModuleComplete()
    }
  })

  // Setup Volume Listening
  useEffect(() => {
    const showVolumeToast = (volume: number) => {
      // Show user a toast warning
      if (toastRef.current === undefined && volume < 1) {
        toastRef.current = Alert.toast(
          'Volume Change Detected',
          'Please increase volume back to 100%',
        )
      } else if (volume === 1) {
        // Hide Toast since we restored volume
        toastRef.current?.dismiss()
        toastRef.current = undefined
      }
    }

    AudioSensor.getCurrentVolume().then(showVolumeToast)
    volumeSensorListener.current = AudioSensor.addVolumeListener(
      showVolumeToast,
    )

    // Cleanup refs
    return () => {
      volumeSensorListener.current?.remove()
      toastRef.current?.dismiss()
    }
  }, [])

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
    Math.floor(
      Math.random() * (intervalBounds.max - intervalBounds.min + 1) +
        intervalBounds.min,
    ) * 1000

  // Render the current trial
  const currentTrial = mod.trials[mod.currentTrialIndex]
  return (
    currentTrial && (
      <FearConditioningTrialScreen
        key={`trial-${mod.currentTrialIndex}`}
        stimulusImage={currentTrial.stimulusImage}
        contextImage={experiment.definition.contextStimuli[mod.context]}
        unconditionalStimulus={experiment.definition.unconditionalStimulus}
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
  conditionalStimuli: VisualStimuli[],
  generalisationStimuli: VisualStimuli[],
): Trial[] {
  // Determine which image matches what stimulus
  let stimuli = shuffle(conditionalStimuli)
  const positiveStimuli: VisualStimuli = stimuli[0]
  const negativeStimuli: VisualStimuli = stimuli[1]

  // Create equal amounts of trials
  let positiveStimuliTrials: Trial[] = []
  let negativeStimuliTrials: Trial[] = []
  for (var i = 0; i < trialsPerStimulus; i++) {
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
  let trialsHead = shuffle([
    positiveStimuliTrials.shift(),
    negativeStimuliTrials.shift(),
  ])

  // Store remaining CS in seperate array that concatonates with the head.
  let trials: Trial[] = []

  // Add GS if nessacery
  if (generalisationStimuli.length > 0) {
    // We transform the label to it's GS identifier (i.e GSA) and it's coding id (i.e GS2, meaning 2 increments away from the CS+)
    const gsCodingDescending = positiveStimuli.label == 'csa'
    const gsCoding = {
      gsa: gsCodingDescending ? 1 : 4,
      gsb: gsCodingDescending ? 2 : 3,
      gsc: gsCodingDescending ? 3 : 2,
      gsd: gsCodingDescending ? 4 : 1,
    }

    trials = generalisationStimuli.map((gs) => ({
      label: `${gs.label}/${gsCoding[gs.label]}`,
      stimulusImage: gs.image,
      reinforced: false,
    }))
  }

  // Shuffle sets to mix reinforced trials
  trials = shuffle(trials)
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
  return trialsHead.concat(trials)
}
