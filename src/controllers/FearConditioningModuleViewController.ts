import { ExperimentViewController } from './ExperimentViewController'
import { GenericModuleViewController } from './GenericModuleViewController'
import { ExperimentCriteria, FearConditioningTrialScreen } from '@screens'
import { navigateToScreen } from '@utils/navigation'
import shuffleArray from '@utils/shuffle'

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
  rating?: number
}

export class FearConditioningModuleViewController extends GenericModuleViewController<
  FearConditioningModuleState
> {
  // Record what trial we are currently viewing
  currentTrialIndex = 0

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

    // Render the trial
    navigateToScreen<any>(FearConditioningTrialScreen.screenID, {
      ...currentTrial,
      ratingDelay: this.moduleState.ratingDelay,
      trialLength: this.moduleState.trialLength,
      contextImage: this.moduleState.contextImage,
      onTrialEnd: (value) => this.onSubmit(value, experimentVC),
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
    let images = this.moduleState.stimuliImages
    shuffleArray(images)
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
    let trials = [positiveStimuli.shift(), negativeStimuli.shift()]
    shuffleArray(trials)

    // Merge positive and negative stimuli and shuffle...
    let mergedTail = [].concat(positiveStimuli, negativeStimuli)
    shuffleArray(mergedTail)

    // Rule 3: Merge positive and negative stimuli with a maxiumum of 2 stimuli in consectutive order
    for (var i = 0; i < positiveStimuli.length; i++) {
      // Get one of each stimuli
      let tail = [positiveStimuli.shift(), negativeStimuli.shift()]
      // Shuffle order
      shuffleArray(tail)
      // Append to end of our existing trials
      trials = trials.concat(tail)
    }

    // Return the generated trials.
    return trials
  }

  /**
   * Called when the user submits their response.
   */
  onSubmit(value: number, experimentVC: ExperimentViewController) {
    // Set the users rating
    this.moduleState.trials[this.currentTrialIndex].rating = value
    // Move to next trial
    this.currentTrialIndex = this.currentTrialIndex + 1
    // Save changes
    this.saveState()
    // If we have run out of trials then call next module
    if (this.currentTrialIndex === this.moduleState.trials.length) {
      experimentVC.onModuleComplete()
    } else {
      // Render the new trial
      this.render(experimentVC)
    }
  }
}
