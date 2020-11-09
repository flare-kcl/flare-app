import { useDispatch } from 'react-redux'
import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import AsyncStorage from '@react-native-community/async-storage'
import logger from 'redux-logger'
import thunk from 'redux-thunk'

import { eventReducer, rnAppStateReducer } from './reducers'

const reducers = combineReducers({
  events: eventReducer,
  appState: rnAppStateReducer,
})

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
}

export const store = configureStore({
  reducer: persistReducer(persistConfig, reducers),
  middleware: [thunk, logger],
})

export const peristor = persistStore(store)

export type AppState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>()
