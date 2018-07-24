// @flow

import { createAction, handleActions } from 'redux-actions'

const INCREMENT_NONCE = 'SONGS/INCREMENT_NONCE'

export const incrementNonce = createAction(INCREMENT_NONCE)

export type SongsState = {|
  nonce: number,
|}

const defaultState: SongsState = {
  nonce: 0,
}

export const hydrators = {}
export const reducer = handleActions(
  {
    [INCREMENT_NONCE]: (state: SongsState) => ({
      ...state,
      nonce: state.nonce + 1,
    }),
  },
  defaultState,
)
