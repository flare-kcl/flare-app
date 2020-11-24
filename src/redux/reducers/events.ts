import { createAction, createReducer } from '@reduxjs/toolkit'

// Events are described by EventType
type EventTypes = 'SuspensionPeriod' | 'VolumeChange'

// Each event has a set 'shape'
export type EventRecord = {
  recorded: number
  eventType: EventTypes
  value: string
  info?: Object
}

// Events are strung together to describe enviromental factors of an experiment
type EventTimeline = EventRecord[]

// Create an events reducer that stores all events
export const recordEvent = createAction<EventRecord>('events/record')
export const clearAllEvents = createAction<EventRecord>('events/clear')
export const eventReducer = createReducer<EventTimeline>([], (builder) => {
  builder.addCase(recordEvent, (state, action) => {
    // Append new event to timeline
    state.push(action.payload)
    // Return update pipeline
    return state
  })

  // Delete all the events
  builder.addCase(clearAllEvents, () => {
    return []
  })
})
