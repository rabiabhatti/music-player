// @flow

import { combineReducers } from 'redux'

import user from './user'
import songs from './songs'
import router from './router'

export default combineReducers({
  user,
  songs,
  router,
})
