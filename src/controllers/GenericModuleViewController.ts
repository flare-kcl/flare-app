import { store } from '@redux/store'
import { updateModule } from '@redux/reducers'

export abstract class GenericModuleViewController<StateType> {
  moduleId: string
  moduleType: string
  moduleState: StateType

  constructor(moduleId: string, moduleType: string, moduleState: StateType) {
    this.moduleId = moduleId
    this.moduleType = moduleType
    this.moduleState = moduleState
  }

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
