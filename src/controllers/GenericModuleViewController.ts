import { store } from '@redux/store'
import { updateModule } from '@redux/reducers'
import { ExperimentViewController } from './ExperimentViewController'

export abstract class GenericModuleViewController<StateType = Object> {
  moduleId: string
  moduleType: string
  moduleState: StateType

  constructor(moduleId: string, moduleType: string, moduleState: StateType) {
    this.moduleId = moduleId
    this.moduleType = moduleType
    this.moduleState = moduleState
  }

  /**
   * Triggers the module to present the screen that the user should be interacting with
   *
   * @param experiment
   */
  abstract render(experiment: ExperimentViewController)

  /**
   * Save the modules state to redux
   */
  saveState() {
    store.dispatch(
      updateModule({
        moduleId: this.moduleId,
        moduleType: this.moduleType,
        moduleState: this.moduleState,
      }),
    )
  }
}
