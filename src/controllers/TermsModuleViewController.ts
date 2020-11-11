import { TermsScreen, TermsScreenParams } from '@screens'
import { navigateToScreen } from '@utils/navigation'
import { ExperimentViewController } from './ExperimentViewController'
import { GenericModuleViewController } from './GenericModuleViewController'

interface TermsModuleState {
  terms: string
}

export class TermsModuleViewController extends GenericModuleViewController<TermsModuleState> {
  /**
   * Hosts the single terms screen
   */
  render(experiement: ExperimentViewController) {
    navigateToScreen<TermsScreenParams>(TermsScreen.screenID, {
      terms: this.moduleState.terms,
      onAccept: () => experiement.onModuleComplete(),
      onExit: () => experiement.terminateExperiment(),
    })
  }
}
