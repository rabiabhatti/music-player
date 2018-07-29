// @flow

import { createAction, handleActions } from 'redux-actions'

const SET_SELECTED = 'SONGS/SET_SELECTED'
const INCREMENT_NONCE = 'SONGS/INCREMENT_NONCE'

export const setSelected = createAction(SET_SELECTED)
export const incrementNonce = createAction(INCREMENT_NONCE)

export type SongsStateSelected = {|
  type: 'album' | 'artist' | 'playlist' | 'genre',
  identifier: string,
|}
export type SongsState = {|
  nonce: number,
  selected: ?SongsStateSelected,
|}

const defaultState: SongsState = {
  nonce: 0,
  selected: null,
}

export const hydrators = {}
export const reducer = handleActions(
  {
    [INCREMENT_NONCE]: (state: SongsState) => ({
      ...state,
      nonce: state.nonce + 1,
    }),
    [SET_SELECTED]: (state: SongsState, { payload: selected }) => ({
      ...state,
      selected,
    }),
  },
  defaultState,
)
