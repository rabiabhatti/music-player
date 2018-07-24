// @flow

import { createStore, combineReducers } from 'redux'

import * as user from './user'
import * as songs from './songs'

const states = {
  user,
  songs,
}
const reducers = Object.keys(states).reduce(
  (agg, curr) => ({
    ...agg,
    [curr]: states[curr].reducer,
  }),
  {},
)
const hydrators = Object.keys(states).reduce(
  (agg, curr) => ({
    ...agg,
    [curr]: states[curr].hydrators,
  }),
  {},
)

const LOCAL_STORAGE_KEY = 'reduxState'
function getCachedState() {
  const storedVal = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '{}')
  Object.keys(hydrators).forEach(item => {
    const localState = storedVal[item]
    const localHydrators = hydrators[item]
    if (!localState) return
    Object.keys(localHydrators).forEach(localHydratorKey => {
      const localHydratorState = localState[localHydratorKey]
      if (localHydratorState) {
        localState[localHydratorKey] = new localHydrators[localHydratorKey](localHydratorState)
      }
    })
  })

  return storedVal
}

const store = createStore(combineReducers(reducers), getCachedState())

store.subscribe(() => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(store.getState()))
})

export default store
