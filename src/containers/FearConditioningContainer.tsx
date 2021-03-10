import { useEffect, useCallback, useState, useRef } from 'react'
import { EmitterSubscription } from 'react-native'
import shuffle from 'lodash/shuffle'
import random from 'lodash/random'
import { ExperimentModule, VisualStimuli } from './ExperimentContainer'
import {
  FearConditioningTrialScreen,
  FearConditioningTrialResponse,
} from '@screens'
import { ToastRef, AlertRef } from '@components'
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

export type Trial = {
  label: string
  stimulusIndex: number
  normalisedLabel: string
  stimulusImage: any
  reinforced: boolean
  response?: FearConditioningTrialResponse
  synced?: boolean
}

export const FearConditioningContainer: ExperimentModule<FearConditioningModuleState> = ({
  experiment,
  module: mod,
  updateModule,
  onModuleComplete,
  syncExperiment,
  syncExperimentProgress,
  unconditionalStimulus,
}) => {
  const Alert = useAlert()
  const [trialSkipCount, setTrialSkipCount] = useState(0)
  const toastRef = useRef<ToastRef>()
  const alertRef = useRef<AlertRef>()
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
          experiment.definition.conditionalStimuli['cs+'],
          experiment.definition.conditionalStimuli['cs-'],
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
      const minVolume = experiment.definition.minimumVolume
      if (toastRef.current === undefined && volume < minVolume) {
        toastRef.current = Alert.toast(
          'Volume Change Detected',
          `Please increase volume back to ${(minVolume * 100).toFixed(0)}%`,
        )
      } else if (volume >= minVolume) {
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
      // Record if the response was skipped, if not reset counter
      if (trialResponse.skipped) {
        setTrialSkipCount(trialSkipCount + 1)
      } else if (trialSkipCount == 1) {
        setTrialSkipCount(0)
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

      // Sync experiment after each trial
      syncExperiment()
    },
    [mod, trialSkipCount],
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

  // Show alert if two consecutive trial skips
  if (trialSkipCount > 1) {
    if (alertRef.current == undefined) {
      alertRef.current = Alert.alert(
        'Attention Required',
        'You have not been rating trials in the designated time, please try to respond as fast as you can.',
        [
          {
            label: 'Continue',
            onPress: () => {
              // Continue with trials
              setTrialSkipCount(1)
              alertRef.current.dismiss()
              alertRef.current = undefined
            },
          },
        ],
      )
    }

    // Show blank/white screen
    return null
  }

  // Render the current trial
  const currentTrial = mod.trials[mod.currentTrialIndex]
  return (
    currentTrial && (
      <FearConditioningTrialScreen
        key={`trial-${mod.currentTrialIndex}`}
        stimulusImage={currentTrial.stimulusImage}
        contextImage={experiment.definition.contextStimuli[mod.context]}
        unconditionalStimulus={unconditionalStimulus}
        trialDelay={trialDelay}
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
export function generateTrials(
  trialsPerStimulus: number,
  reinforcementRate: number,
  positiveStimuli: VisualStimuli,
  negativeStimuli: VisualStimuli,
  generalisationStimuli: VisualStimuli[],
): Trial[] {
  // Create equal amounts of trials
  let positiveStimuliTrials: Trial[] = []
  let negativeStimuliTrials: Trial[] = []
  let generalisationStimuliTrials: Trial[][] = []
  const shouldAddGS = generalisationStimuli.length > 0

  // Store remaining CS in seperate array that concatonates with the head.
  let trials: Trial[] = []

  for (let i = 0; i <= trialsPerStimulus - 1; i++) {
    // Generate positive stimulus trial
    positiveStimuliTrials.push({
      label: positiveStimuli.label,
      normalisedLabel: 'cs+',
      stimulusImage: positiveStimuli.image,
      reinforced: i < reinforcementRate,
      stimulusIndex: 0,
    })

    // Generate negative stimulus trial
    negativeStimuliTrials.push({
      label: negativeStimuli.label,
      normalisedLabel: 'cs-',
      stimulusImage: negativeStimuli.image,
      reinforced: false,
      stimulusIndex: 0,
    })

    // Add GS if nessacery
    if (shouldAddGS) {
      // We transform the label to it's GS identifier (i.e GSA) and it's coding id (i.e GS2, meaning 2 increments away from the CS+)
      const gsCodingDescending = positiveStimuli.label == 'csa'
      const gsCoding = {
        gsa: gsCodingDescending ? 1 : 4,
        gsb: gsCodingDescending ? 2 : 3,
        gsc: gsCodingDescending ? 3 : 2,
        gsd: gsCodingDescending ? 4 : 1,
      }

      generalisationStimuliTrials.push(
        shuffle(
          generalisationStimuli.map((gs) => ({
            label: gs.label,
            normalisedLabel: 'gs' + gsCoding[gs.label],
            stimulusImage: gs.image,
            reinforced: false,
          })),
        ),
      )
    } else {
      generalisationStimuliTrials.push([])
    }
  }

  // Rule 1: First two trials must be one of each (in random order)
  // Rule 2: The first positive stimuli must be reinforced (hence the shift instead of pop)
  let trialsHead = [
    ...shuffle([positiveStimuliTrials.shift(), negativeStimuliTrials.shift()]),
    ...generalisationStimuliTrials.shift(),
  ]

  // Shuffle sets to mix reinforced trials
  trials = shuffle(trials)
  positiveStimuliTrials = shuffle(positiveStimuliTrials)
  negativeStimuliTrials = shuffle(negativeStimuliTrials)

  // Rule 3: Merge positive and negative stimuli with a maxiumum of 2 stimuli in consectutive order
  for (let i = 0; i <= trialsPerStimulus - 2; i++) {
    // Get one of each stimuli & shuffle
    let tail = shuffle([
      positiveStimuliTrials.shift(),
      negativeStimuliTrials.shift(),
      ...generalisationStimuliTrials.shift(),
    ])

    // Append to end of our existing trials
    trials = trials.concat(tail)
  }

  // Return the generated trials.
  let orderedTrials = trialsHead.concat(trials)

  // Add 'trial_by_stimulus' label
  // Keep index references of each stimulus label
  let trialIndex = {
    csa: 0,
    csb: 0,
    gsa: 0,
    gsb: 0,
    gsc: 0,
    gsd: 0,
  }

  orderedTrials = orderedTrials.map((trial) => {
    // Calculate index for each trial
    const stimulusIndex = trialIndex[trial.label]
    trialIndex[trial.label] = trialIndex[trial.label] + 1

    return {
      ...trial,
      stimulusIndex,
      synced: false,
    }
  })

  return orderedTrials
}
