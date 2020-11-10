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

// Create an events reducer that stores all events
export const updateExperiment = createAction<ExperimentCacheUpdate>(
  'experiment/update',
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
  },
)
