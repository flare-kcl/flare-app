import { TermsModuleViewController } from './TermsModuleViewController'
import { CriteriaModuleViewController } from './CriteriaModuleViewController'
import { LoginScreen, RejectionScreen } from '@screens'
import { navigate } from '@utils/navigation'
import { store } from '@redux/store'
import {
  experimentSelector,
  moduleSelector,
  latestEventSelector,
} from '@redux/selectors'
import {
  updateExperiment,
  clearExperiment,
  clearAllModules,
  clearAllEvents,
} from '@redux/reducers'
import { GenericModuleViewController } from './GenericModuleViewController'
import { FearConditioningModuleViewController } from './FearConditioningModuleViewController'

export type ExperimentModuleType = 'TERMS' | 'CRITERIA'

const ModuleViewControllers = {
  TERMS: TermsModuleViewController,
  CRITERIA: CriteriaModuleViewController,
  FEAR_CONDITIONING: FearConditioningModuleViewController,
}

type ExperimentModuleConfig = {
  id: string
  moduleType: string
  definition: Object
}

export type Experiment = {
  id: number
  name: string
  description: string
  contactEmail?: string
  modules: ExperimentModuleConfig[]
  ratingDelay: number
  trialLength: number
  intervalTimeBounds: {
    min: number
    max: number
  }
}

export class ExperimentViewController {
  experiment: Experiment
  particpantRejected = false
  private currentModuleIndex: number = 0
  private experimentModules: GenericModuleViewController[]
  private focusModeEnabled?: boolean
  private unsubscribeEventListener?: Function

  constructor(experiment: Experiment) {
    // Store experiment description
    this.experiment = experiment

    // Listen to any app state chanyes (i.e Events)
    this.unsubscribeEventListener = this.eventListener()

    // Initialize modules and skip any unknown ones
    const currentState = store.getState()
    this.experimentModules = experiment.modules
      .map((mod) => {
        // If an appropriate view controller exists, use it!
        if (mod.moduleType in ModuleViewControllers) {
          // Check if a cache version of the module exists
          const cachedModule = moduleSelector(currentState, mod.id)

          // Initialize module with fresh or cached state
          return new ModuleViewControllers[mod.moduleType](
            mod.id,
            mod.moduleType,
            cachedModule?.moduleState ?? mod.definition,
          )
        }

        // Report unknown module
        console.warn('Unknown Module: ', mod.moduleType)
        return null
      })
      .filter((mod) => mod !== null)
  }

  /**
   * Start presenting the experiment to the particpant.
   */
  present() {
    this.saveExperiment()
    this.render()
  }

  /**
   * Called by a module once its tasks are finished.
   */
  onModuleComplete() {
    this.renderNextModule()
  }

  /**
   * Stops the experiment instantly and shows participant rejection screen
   */
  screenOutParticipant() {
    // Record that we have screened out the participant
    this.particpantRejected = true

    // Delete the experiment cache
    this.terminateExperiment(false)

    // Show them rejection screen
    navigate(RejectionScreen.screenID, {
      onExit: () => ExperimentViewController.presentLogin(),
    })
  }

  /**
   * Deletes the experiment cache and shows the user the login screen
   */
  terminateExperiment(redirect = true) {
    // Disconnect from store
    this.unsubscribeEventListener()
    // Delete the experiment cache
    store.dispatch(clearExperiment())
    // Delete all event data
    store.dispatch(clearAllEvents())
    // Delete all the module cache
    store.dispatch(clearAllModules())
    // Show the login screen
    if (redirect) {
      ExperimentViewController.presentLogin()
    }
  }

  /**
   * React to any state changes
   */
  private eventListener(): () => void {
    return store.subscribe(() => {
      // Get the latest state
      const state = store.getState()

      // Get the latest entry from our event queue
      const latestEvent = latestEventSelector(state)

      // TODO: Change this back to 1 hour
      const SUSPENDED_TIMEOUT = 60000
      const STRICT_SUSPENED_TIMEOUT = 30000

      // Check if user has suspened app in crucial stage
      if (latestEvent?.eventType == 'SuspensionPeriod') {
        // If app was suspened longer than timeout threshold...
        const suspenedTime = Number(latestEvent.value)
        if (
          suspenedTime > SUSPENDED_TIMEOUT ||
          (this.focusModeEnabled && suspenedTime > STRICT_SUSPENED_TIMEOUT)
        ) {
          this.screenOutParticipant()
        }
      }
    })
  }

  /**
   * Focus mode allows the experiment to determine whether a user suspending the app is detrimental
   * to the data intergrity.
   */
  setFocusMode(value: boolean) {
    this.focusModeEnabled = value
  }

  /**
   * Utility function to easily present the login screen
   */
  static presentLogin() {
    navigate(LoginScreen.screenID, {})
  }

  /**
   * Allows you to recover the experiment if app has been quit mid-experiment
   */
  static recoverExperiment(): ExperimentViewController {
    const experimentState = experimentSelector(store.getState())
    if (experimentState.definition) {
      const experimentVC = new ExperimentViewController(
        experimentState.definition,
      )
      // Manually update fields
      experimentVC.currentModuleIndex = experimentState.currentModuleIndex
      // Return the recovered exeriment
      return experimentVC
    }

    return null
  }

  /**
   * Saves the experiment state to aid in recovery
   */
  saveExperiment() {
    store.dispatch(
      updateExperiment({
        definition: this.experiment,
        currentModuleIndex: this.currentModuleIndex,
      }),
    )
  }

  /**
   * Presents the current module.
   */
  private render() {
    const currentModule = this.getCurrentModule()
    // TODO: Swap out for reimbursment screen evetually
    if (currentModule !== undefined) {
      currentModule.render(this)
    } else {
      this.terminateExperiment()
    }
  }

  /**
   * Iterates to next module and calls .render()
   */
  private renderNextModule() {
    this.currentModuleIndex = this.currentModuleIndex + 1
    this.saveExperiment()
    this.render()
  }

  /**
   * Use the internal module index to retrive the current module
   */
  private getCurrentModule(): GenericModuleViewController {
    return this.experimentModules[this.currentModuleIndex]
  }
}
