import { AppState } from '@redux/store'
import { EventRecord, ExperimentCache } from '@redux/reducers'

export const experimentSelector = (state: AppState): ExperimentCache =>
  state.experiment

export const moduleSelector = (state: AppState, moduleId) =>
  state.modules[moduleId]

export const currentModuleSelector = (state: AppState) => {
  const currentIndex = state.experiment.currentModuleIndex
  const currentModule = state.experiment.definition?.modules[currentIndex]
  return currentModule && moduleSelector(state, currentModule.id)
}

export const latestEventSelector = (state: AppState): EventRecord | undefined =>
  state.events[state.events.length - 1]
