// @flow

import { createAction, handleActions } from 'redux-actions'

const SET_SELECTED = 'COMPONENTS/COMPONENT_SELECTED'
const PLAYLIST_SELECTED = 'COMPONENTS/PLAYLIST_SELECTED'

export const setSelected = createAction(SET_SELECTED)
export const playlistSelected = createAction(PLAYLIST_SELECTED)

export type PlaylistStateSelected = {|
  id: ?number,
|}
export type ComponentsStateSelected = {|
  type: 'Albums' | 'Artists' | 'Playlist' | 'Genres' | 'Songs' | 'RecentlyPlayed',
|}
export type ComponentsState = {|
  selected: ComponentsStateSelected,
  playlist: PlaylistStateSelected,
|}

const defaultState: ComponentsState = {
  selected: { type: 'Songs' },
  playlist: { id: null },
}

export default handleActions(
  {
    [SET_SELECTED]: (state: ComponentsState, { payload: selected }) => ({
      ...state,
      selected,
    }),
    [PLAYLIST_SELECTED]: (state: ComponentsState, { payload: playlist }) => ({
      ...state,
      playlist,
    }),
  },
  defaultState,
)
