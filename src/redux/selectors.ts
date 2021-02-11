import { AppState } from '@redux/store'
import {
  EventRecord,
  ExperimentCache,
  ExperimentModuleCache,
} from '@redux/reducers'

export const experimentSelector = (state: AppState): ExperimentCache =>
  state.experiment

export const moduleSelector = (state: AppState, moduleId) =>
  state.modules[moduleId]

export const currentModuleSelector = (
  state: AppState,
): ExperimentModuleCache => {
  const currentIndex = state.experiment.currentModuleIndex
  return Object.values(state.modules).find(
    (mod: ExperimentModuleCache) => mod.index === currentIndex,
  )
}

export const unsyncedModulesSelector = (state: AppState) =>
  Object.values(state.modules).filter(
    (mod: ExperimentModuleCache) => mod.moduleCompleted && !mod.moduleSynced,
  )

export const allModulesSelector = (state: AppState): ExperimentModuleCache[] =>
  Object.values(state.modules).sort(
    (a: ExperimentModuleCache, b: ExperimentModuleCache) => a.index - b.index,
  ) as ExperimentModuleCache[]

export const allModulesSyncedSelector = (state: AppState): boolean =>
  allModulesSelector(state).filter(
    (mod: ExperimentModuleCache) =>
      mod.moduleCompleted && mod.moduleSynced === false,
  ).length === 0

export const latestEventSelector = (state: AppState): EventRecord | undefined =>
  state.events[state.events.length - 1]
