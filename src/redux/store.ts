import { useDispatch } from 'react-redux'
import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import AsyncStorage from '@react-native-async-storage/async-storage'
import thunk from 'redux-thunk'

import {
  eventReducer,
  rnAppStateReducer,
  experimentReducer,
  moduleReducer,
  alertReducer,
} from './reducers'

const reducers = combineReducers({
  events: eventReducer,
  appState: rnAppStateReducer,
  modules: moduleReducer,
  experiment: experimentReducer,
  alerts: alertReducer,
})

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  blacklist: ['alerts'],
}

export const store = configureStore({
  reducer: persistReducer(persistConfig, reducers),
  middleware: [thunk],
})

export const peristor = persistStore(store)

export type AppState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>()
