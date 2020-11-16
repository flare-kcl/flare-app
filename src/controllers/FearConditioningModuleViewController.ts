import { Alert } from 'react-native'
import { ExperimentViewController } from './ExperimentViewController'
import { GenericModuleViewController } from './GenericModuleViewController'
import {
  FearConditioningTrialScreen,
  FearConditioningTrialResponse,
} from '@screens'
import { navigateToScreen } from '@utils/navigation'
import { shuffle } from 'lodash'

interface FearConditioningModuleState {
  phase: string
  trialsPerStimulus: number
  reinforcementRate: number
  ratingDelay: number
  trialLength: number
  generalisationStimuliEnabled: boolean
  stimuliImages: any[]
  contextImage: any
  trials?: Trial[]
}

interface Trial {
  label: string
  stimulusImage: any
  reinforced: boolean
  response?: FearConditioningTrialResponse
}

export class FearConditioningModuleViewController extends GenericModuleViewController<
  FearConditioningModuleState
> {
  // Record what trial we are currently viewing
  currentTrialIndex = 0
  // Record if the last trial resulted in a skip
  lastTrialSkipped = false

  /**
   * Custom constructor to build out trials before render
   */
  constructor(
    moduleId: string,
    moduleType: string,
    moduleState: FearConditioningModuleState,
  ) {
    // Initiaize variables
    super(moduleId, moduleType, moduleState)
    // Generate trial order if non provided
    if (!this.moduleState.trials) {
      this.currentTrialIndex = 0
      this.moduleState.trials = this.generateTrials(
        this.moduleState.trialsPerStimulus,
        this.moduleState.reinforcementRate,
      )
    }
  }

  /**
   * Renders a trial screen or continues to next module
   */
  render(experimentVC: ExperimentViewController) {
    // Get the trial we need to render
    const currentTrial = this.moduleState.trials[this.currentTrialIndex]

    // Get the interval bounds of the experiment
    const intervalBounds = experimentVC.experiment.intervalTimeBounds
    const trialDelay =
      Math.min(
        intervalBounds.max,
        Math.max(intervalBounds.min, Math.random()),
      ) * 1000

    // Render the trial
    navigateToScreen<any>(FearConditioningTrialScreen.screenID, {
      ...currentTrial,
      trialDelay,
      ratingDelay: this.moduleState.ratingDelay,
      trialLength: this.moduleState.trialLength,
      contextImage: this.moduleState.contextImage,
      onTrialEnd: (response: FearConditioningTrialResponse) =>
        this.onSubmit(response, experimentVC),
    })
  }

  /**
   * Build a sequence of trials based on a set of rules
   *
   * @param experimentVC
   */
  generateTrials(
    trialsPerStimulus: number,
    reinforcementRate: number,
  ): Trial[] {
    // Determine which image matches what stimulus
    let images = shuffle(this.moduleState.stimuliImages)

    const positiveStimuliImage = images[0]
    const negativeStimuliImage = images[1]

    // Create equal amounts of trials
    let positiveStimuli: Trial[] = []
    let negativeStimuli: Trial[] = []
    for (var i = 0; i < trialsPerStimulus; i++) {
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

  /**
   * Called when the user skips two consecutive trials
   *
   * @param experimentVC
   */
  onSkip(experimentVC: ExperimentViewController) {
    Alert.alert(
      'Attention Required',
      'You have not been rating trials in the designated time, Please try to answer them as fast as you can.',
      [
        {
          text: 'Exit Experiment',
          onPress: () => experimentVC.screenOutParticipant(),
          style: 'cancel',
        },
        {
          text: 'Continue to next trial',
          onPress: () => this.render(experimentVC),
        },
      ],
      { cancelable: false },
    )
  }

  /**
   * Called when the user submits their response.
   *
   * @param response
   * @param experimentVC
   */
  onSubmit(
    response: FearConditioningTrialResponse,
    experimentVC: ExperimentViewController,
  ) {
    // Set the users rating
    this.moduleState.trials[this.currentTrialIndex].response = response
    // Move to next trial
    this.currentTrialIndex = this.currentTrialIndex + 1
    // Save changes
    this.saveState()
    // If we have run out of trials then call next module
    if (this.currentTrialIndex === this.moduleState.trials.length) {
      experimentVC.onModuleComplete()
    }
    // If they skipped too consecutuive times then we need to alert them
    else if (this.lastTrialSkipped && response.skipped) {
      this.onSkip(experimentVC)
    } else {
      // Record if this trial was skipped
      this.lastTrialSkipped = response.skipped
      // Render the new trial
      this.render(experimentVC)
    }
  }
}
