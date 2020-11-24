import { AppState } from '@redux/store'
import { EventRecord } from '@redux/reducers'

export const experimentSelector = (state: AppState) => state.experiment

export const moduleSelector = (state: AppState, moduleId) =>
  state.modules[moduleId]

export const latestEventSelector = (state: AppState): EventRecord | undefined =>
  state.events[state.events.length - 1]
