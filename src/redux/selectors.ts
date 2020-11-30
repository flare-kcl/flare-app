import { AppState } from '@redux/store'
import { EventRecord, ExperimentCache } from '@redux/reducers'

export const experimentSelector = (state: AppState): ExperimentCache =>
  state.experiment

export const moduleSelector = (state: AppState, moduleId) =>
  state.modules[moduleId]

export const currentModuleSelector = (state: AppState) =>
  moduleSelector(state, state.experiment.currentModuleIndex)

export const latestEventSelector = (state: AppState): EventRecord | undefined =>
  state.events[state.events.length - 1]
