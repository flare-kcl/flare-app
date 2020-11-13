import { TermsModuleViewController } from './TermsModuleViewController'
import { CriteriaModuleViewController } from './CriteriaModuleViewController'
import { LoginScreen, RejectionScreen } from '@screens'
import { navigate } from '@utils/navigation'
import { store } from '@redux/store'
import { experimentSelector, moduleSelector } from '@redux/selectors'
import {
  updateExperiment,
  clearExperiment,
  clearAllModules,
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
  name: string
  description: string
  code: string
  contactEmail?: string
  modules: ExperimentModuleConfig[]
}

export class ExperimentViewController {
  private experiment: Experiment
  private currentModuleIndex: number = 0
  private experimentModules: GenericModuleViewController[]

  constructor(experiment: Experiment) {
    // Store experiment description
    this.experiment = experiment

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
    // Delete the experiment cache
    this.terminateExperiment(false)

    // Show them rejection screen
    navigate(RejectionScreen.screenID, {
      onExit: () => this.terminateExperiment(),
    })
  }

  /**
   * Deletes the experiment cache and shows the user the login screen
   */
  terminateExperiment(redirect = true) {
    // Delete the experiment cache
    store.dispatch(clearExperiment())
    // Delete all the module cache
    store.dispatch(clearAllModules())
    // Show the login screen
    if (redirect) {
      ExperimentViewController.presentLogin()
    }
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
  private saveExperiment() {
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
