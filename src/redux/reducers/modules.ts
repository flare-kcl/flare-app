import { createAction, createReducer } from '@reduxjs/toolkit'

type ModuleCacheUpdate = {
  moduleId: string
  moduleType: string
  moduleState: any
}

// Create an events reducer that stores all events
export const updateModule = createAction<ModuleCacheUpdate>('module/update')
export const moduleReducer = createReducer({}, (builder) => {
  builder.addCase(updateModule, (state, action) => {
    // See if existing state exists
    const existingModule = state[action.payload.moduleId] ?? {}
    // Update state
    state[action.payload.moduleId] = {
      ...existingModule,
      ...action.payload,
    }
    // Return new state
    return state
  })
})
