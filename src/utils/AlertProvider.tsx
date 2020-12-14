import 'react-native-get-random-values'
import { v4 as uuidv4 } from 'uuid'
import { useDispatch, useSelector } from 'react-redux'
import { Alert, AlertRef, Toast, ToastRef, AlertAction } from '@components'
import { AppState } from '@redux/store'
import {
  dismissAlert,
  dismissToast,
  showAlert,
  showToast,
  AlertRecord,
  ToastRecord,
} from '@redux/reducers'
import { ThemeColors } from './theme'

const createAlertRef = (dispatch, alert): AlertRef => ({
  dismiss: () => dispatch(dismissAlert(alert.id)),
})

const createToastRef = (dispatch, toast): ToastRef => ({
  dismiss: () => dispatch(dismissToast(toast.id)),
})

export const AlertProvider = () => {
  const dispatch = useDispatch()

  // Get the alert from top of the stack
  const currentAlert = useSelector((state: AppState) => state.alerts.alerts[0])
  const currentToast = useSelector((state: AppState) => state.alerts.toasts[0])

  // Object passed to event handlers
  const alertRef = createAlertRef(dispatch, currentAlert)
  const toastRef = createAlertRef(dispatch, currentToast)

  return (
    <>
      {currentAlert != undefined && (
        <Alert
          key={`alert-${currentAlert.id}`}
          alertRef={alertRef}
          {...currentAlert}
        />
      )}

      {currentToast != undefined && (
        <Toast
          key={`toast-${currentToast.id}`}
          toastRef={toastRef}
          {...currentToast}
        />
      )}
    </>
  )
}

type AlertInterface = {
  alert: (
    title: string,
    description: string,
    actions?: AlertAction[],
    color?: ThemeColors,
  ) => AlertRef
  toast: (title: string, description: string) => ToastRef
}

export const useAlert = (): AlertInterface => {
  const dispatch = useDispatch()

  return {
    alert: (title, description, actions = [], color = 'red') => {
      // Create alert
      const alert: AlertRecord = {
        id: uuidv4(),
        title,
        description,
        actions,
        color,
      }

      // Save alert to state
      dispatch(showAlert(alert))

      // Return the ref to caller
      return createAlertRef(dispatch, alert)
    },

    toast: (title, description) => {
      // Create a toast
      const toast: ToastRecord = {
        id: uuidv4(),
        title,
        description,
      }

      // Save alert to state
      dispatch(showToast(toast))

      // Return the ref to caller
      return createToastRef(dispatch, toast)
    },
  }
}
