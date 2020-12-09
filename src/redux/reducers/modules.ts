import { createAction, createReducer } from '@reduxjs/toolkit'

export type ExperimentModule<StateType = any> = {
  moduleId: string
  moduleType: string
  moduleState: StateType
  moduleCompleted?: boolean
  moduleSynced?: boolean
}

export const updateModule = createAction<ExperimentModule>('module/update')
export const clearAllModules = createAction<ExperimentModule>(
  'module/clear_all',
)

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

  // Just reset the state...
  builder.addCase(clearAllModules, () => {
    return {}
  })
})
