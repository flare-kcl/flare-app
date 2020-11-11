import { ExperimentViewController } from './ExperimentViewController'
import { GenericModuleViewController } from './GenericModuleViewController'
import {
  CriteriaScreen,
  CriteriaScreenParams,
  ExperimentCriteria,
} from '@screens'
import { navigateToScreen } from '@utils/navigation'

interface CriteriaModuleState {
  criteria: ExperimentCriteria
  description: string
  continueMessage: string
}

export class CriteriaModuleViewController extends GenericModuleViewController<
  CriteriaModuleState
> {
  /**
   * Hosts the single terms screen
   */
  render(experimentVC: ExperimentViewController) {
    navigateToScreen<CriteriaScreenParams>(CriteriaScreen.screenID, {
      criteria: this.moduleState.criteria,
      continueMessage: this.moduleState.continueMessage,
      description: this.moduleState.description,
      onPassCriteria: (critera) => this.onSubmit(critera, experimentVC),
      onExit: () => experimentVC.terminateExperiment(),
      onFailCriteria: () => experimentVC.terminateExperiment(),
    })
  }

  /**
   * Called when the user submits their response.
   */
  onSubmit(
    critera: ExperimentCriteria,
    experimentVC: ExperimentViewController,
  ) {
    // Save results to offline states
    this.moduleState.criteria = critera
    this.saveState()
    // Trigger Experiment to proceed to next module
    experimentVC.onModuleComplete()
  }
}
