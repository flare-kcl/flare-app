import { createAction, createReducer } from '@reduxjs/toolkit'
import { Experiment } from '@containers/ExperimentContainer'

export type ExperimentCache = {
  definition?: Experiment
  currentModuleIndex?: number
  participantRejected: boolean
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

export const rejectParticipant = createAction('experiment/reject')

export const nextModule = createAction('experiment/increment')

const initialState: ExperimentCache = {
  currentModuleIndex: 0,
  participantRejected: false,
}

export const experimentReducer = createReducer<ExperimentCache>(
  initialState,
  (builder) => {
    builder.addCase(updateExperiment, (state, action) => {
      return {
        ...state,
        ...action.payload,
      }
    })

    // Increase the module index
    builder.addCase(nextModule, (state) => {
      return {
        ...state,
        currentModuleIndex: state.currentModuleIndex + 1,
      }
    })

    // Lock out the participant
    builder.addCase(rejectParticipant, (state) => {
      return {
        ...rejectParticipant,
        participantRejected: true,
      }
    })

    // Just reset the state...
    builder.addCase(clearExperiment, () => {
      return initialState
    })
  },
)
