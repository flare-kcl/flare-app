import { createAction, createReducer } from '@reduxjs/toolkit'
import { Experiment } from '@containers/ExperimentContainer'

export type ExperimentCache = {
  participantID?: string
  offlineOnly?: boolean
  definition?: Experiment
  currentModuleIndex?: number
  headphoneType?: HeadphoneType
  participantRejected: boolean
  volume?: number
  isComplete: boolean
}

export const updateExperiment = createAction<ExperimentCache>(
  'experiment/update',
)

export const clearExperiment = createAction<ExperimentCache>('experiment/clear')

export const rejectParticipant = createAction('experiment/reject')

export const nextModule = createAction('experiment/increment')

const initialState: ExperimentCache = {
  volume: 1,
  currentModuleIndex: 0,
  participantRejected: false,
  isComplete: true,
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
        ...state,
        participantRejected: true,
      }
    })

    // Just reset the state...
    builder.addCase(clearExperiment, () => {
      return initialState
    })
  },
)
