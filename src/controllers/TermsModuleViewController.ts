import { TermsScreen, TermsScreenParams } from '@screens'
import { navigateToModuleScreen } from '@utils/navigation'
import { ExperimentViewController } from './ExperimentViewController'

interface TermsModuleState {
  terms: string
}

export class TermsModuleViewController {
  private moduleId: string
  private moduleType: string
  private moduleState: TermsModuleState

  constructor(moduleId, moduleType, moduleState) {
    this.moduleId = moduleId
    this.moduleType = moduleType
    this.moduleState = moduleState
  }

  /**
   * Hosts the single terms screen
   */
  render(experiement: ExperimentViewController) {
    navigateToModuleScreen<TermsScreenParams>(TermsScreen.screenID, {
      terms: this.moduleState.terms,
      onAccept: () => experiement.onModuleComplete(),
      onExit: () => experiement.terminateExperiment(),
    })
  }
}
