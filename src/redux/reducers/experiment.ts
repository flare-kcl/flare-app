import { createAction, createReducer } from '@reduxjs/toolkit'
import { Experiment } from '@containers/ExperimentContainer'
import { HeadphoneType } from '@screens/HeadphoneChoiceScreen'

export type RejectionReason =
  | 'TERMS_DECLINE'
  | 'INCORRECT_CRITERIA'
  | 'TIMEOUT'
  | 'TRIAL_TIMEOUT'
  | 'CORRUPT_ASSETS'
  | 'VOUCHER_ERROR'
  | 'UNKNOWN'

export type ExperimentCache = {
  participantID?: string
  offlineOnly?: boolean
  definition?: Experiment
  currentModuleIndex?: number
  rejectionReason?: RejectionReason
  headphoneType?: HeadphoneType
  volume?: number
  contactEmail?: string
  breakEndDate?: Date
  isComplete: boolean
  notificationsEnabled: boolean
}

export const setExperiment = createAction<ExperimentCache>('experiment/set')

export const updateExperiment = createAction<Partial<ExperimentCache>>(
  'experiment/update',
)

export const clearExperiment = createAction<ExperimentCache>('experiment/clear')

export const rejectParticipant = createAction<RejectionReason>(
  'experiment/reject',
)

export const nextModule = createAction('experiment/increment')

const initialState: ExperimentCache = {
  volume: 1,
  currentModuleIndex: 0,
  isComplete: false,
  notificationsEnabled: false,
}

export const experimentReducer = createReducer<ExperimentCache>(
  initialState,
  (builder) => {
    builder.addCase(setExperiment, (_, action) => {
      return action.payload
    })

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
    builder.addCase(rejectParticipant, (state, action) => {
      return {
        ...state,
        rejectionReason: action.payload,
      }
    })

    // Just reset the state...
    builder.addCase(clearExperiment, (state) => {
      return {
        ...initialState,
        participantID: state.participantID,
        contactEmail: state.contactEmail,
      }
    })
  },
)
