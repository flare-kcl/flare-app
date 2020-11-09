import { check } from 'prettier'
import { store } from './store'

let hydrationAttempts = 0
export const onStateHydrated = (): Promise<void> => {
  const state = store.getState()
  return new Promise((resolve, reject) => {
    const checkState = () => {
      if (state._persist.rehydrated) {
        return resolve()
      } else {
        if (hydrationAttempts < 10) {
          return setTimeout(checkState, 100)
        } else {
          return reject()
        }
      }
    }

    return checkState()
  })
}
