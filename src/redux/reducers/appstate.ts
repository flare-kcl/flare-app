import { createAction, createReducer } from '@reduxjs/toolkit'

// Events are described by EventType
export enum RNAppStateType {
  Active = 'active',
  Inactive = 'inactive',
  Background = 'background',
}

// Each event has a set 'shape'
export type RNAppState = {
  lastUpdated: number
  type: RNAppStateType
}

const initialState: RNAppState = {
  lastUpdated: Date.now(),
  type: RNAppStateType.Active,
}

// Create an events reducer that stores all events
export const updateRNAppState = createAction<RNAppState>('appstate/update')
export const rnAppStateReducer = createReducer<RNAppState>(
  initialState,
  (builder) => {
    builder.addCase(updateRNAppState, (_, action) => {
      return action.payload
    })
  },
)
