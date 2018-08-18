// @flow

import { createStore, combineReducers } from 'redux'
import { getReduxMemory, EngineLocalStorage } from 'redux-memory'
import { Set as ImmSet, Map as ImmMap, Record as ImmRecord } from 'immutable'

import reducers from './reducers'

export default async function getReduxStore() {
  const reducer = combineReducers(reducers)
  const store = getReduxMemory({
    scope: [ImmSet, ImmMap, ImmRecord],
    storage: new EngineLocalStorage('appState'),
    reducer,
    createStore,
  })

  return store
}
