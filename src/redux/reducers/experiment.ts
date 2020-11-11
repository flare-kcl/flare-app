import { createAction, createReducer } from '@reduxjs/toolkit'
import { Experiment } from '@controllers'

type ExperimentCache = {
  definition?: Experiment
  currentModuleIndex?: number
}

type ExperimentCacheUpdate = {
  definition: Experiment
  currentModuleIndex: number
}

export const updateExperiment = createAction<ExperimentCacheUpdate>(
  'experiment/update',
)

export const clearExperiment = createAction<ExperimentCacheUpdate>(
  'experiment/clear',
)

export const experimentReducer = createReducer<ExperimentCache>(
  {},
  (builder) => {
    builder.addCase(updateExperiment, (state, action) => {
      return {
        ...state,
        ...action.payload,
      }
    })

    // Just reset the state...
    builder.addCase(clearExperiment, () => {
      return {}
    })
  },
)
