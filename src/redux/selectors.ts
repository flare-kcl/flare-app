import { AppState } from '@redux/store'

export const experimentSelector = (state: AppState) => state.experiment

export const moduleSelector = (state: AppState, moduleId) =>
  state.modules[moduleId]
