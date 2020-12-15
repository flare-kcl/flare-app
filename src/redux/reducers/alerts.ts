import { createAction, createReducer } from '@reduxjs/toolkit'
import { AlertAction } from '@components'
import { ThemeColors } from '@utils/theme'

export type AlertRequest = {
  title: string
  description: string
  actions: AlertAction[]
  color?: ThemeColors
}

export type ToastRequest = {
  title: string
  description: string
}

export type AlertRecord = AlertRequest & {
  id: string
}

export type ToastRecord = ToastRequest & {
  id: string
}

type AlertState = {
  alerts: AlertRecord[]
  toasts: ToastRecord[]
}

const initialState: AlertState = {
  alerts: [],
  toasts: [],
}

export const showAlert = createAction<AlertRecord>('alerts/show')
export const showToast = createAction<ToastRecord>('toasts/show')
export const dismissAlert = createAction<string>('alerts/dismiss')
export const dismissToast = createAction<string>('toasts/dismiss')

export const alertReducer = createReducer<AlertState>(
  initialState,
  (builder) => {
    builder.addCase(showAlert, (state, action) => {
      // Add alert to bottom of stack
      state.alerts.push(action.payload)

      return state
    })

    builder.addCase(showToast, (state, action) => {
      // Add toast to bottom of stack
      state.toasts.push(action.payload)

      return state
    })

    builder.addCase(dismissAlert, (state, action) => {
      // Remove any alerts with id
      state.alerts = state.alerts.filter((alert) => {
        return alert.id !== action.payload
      })

      return state
    })

    builder.addCase(dismissToast, (state, action) => {
      // Remove any alerts with id
      state.toasts = state.toasts.filter((toast) => {
        return toast.id !== action.payload
      })

      return state
    })
  },
)
