// @flow

import thunk from 'redux-thunk';
import storage from 'redux-persist/lib/storage'
import { createStore, compose, applyMiddleware } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'

import reducers from './reducers'


const persistConfig = {
  key: 'root',
  storage,
  timeout: 0,
}

const persistedReducer = persistReducer(persistConfig, reducers)
const store = createStore(
    persistedReducer,
    {},
    compose(applyMiddleware(thunk))
)
const persistor = persistStore(store)

export { store, persistor }
