// @flow

import { createAction, handleActions } from 'redux-actions'

const SET_SELECTED = 'COMPONENTS/COMPONENT_SELECTED'

export const setSelected = createAction(SET_SELECTED)

export type ComponentsStateSelected = {|
  type: 'Albums' | 'Artists' | 'Playlist' | 'Genres' | 'Songs' | 'RecentlyPlayed',
|}
export type ComponentsState = {|
  selected: ?ComponentsStateSelected,
|}

const defaultState: ComponentsState = {
  selected: null,
}

export const hydrators = {}
export const reducer = handleActions(
  {
    [SET_SELECTED]: (state: ComponentsState, { payload: selected }) => ({
      ...state,
      selected,
    }),
  },
  defaultState,
)
