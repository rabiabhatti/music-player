// @flow

import { createAction, handleActions } from 'redux-actions'

import type { File } from '~/services/types'

const SONG_TO_PLAY = 'SONGS/SONG_TO_PLAY'
const SET_SELECTED = 'SONGS/SET_SELECTED'
const INCREMENT_NONCE = 'SONGS/INCREMENT_NONCE'
const SONGS_LIST_TO_PLAY = 'SONGS/SONGS_LIST_TO_PLAY'
const CURRENT_SONG_CONTROLS = 'SONGS/CURRENT_SONG_CONTROLS'

export const songToPlay = createAction(SONG_TO_PLAY)
export const setSelected = createAction(SET_SELECTED)
export const incrementNonce = createAction(INCREMENT_NONCE)
export const currentSongControls = createAction(CURRENT_SONG_CONTROLS)
export const songsListToPlay = createAction(SONGS_LIST_TO_PLAY)

export type SongsStateSelected = {|
  type: 'album' | 'artist' | 'playlist' | 'genre',
  identifier: string,
|}
export type SongToPlayState = {|
  name: string,
  sourceId: string,
  sourceUid: string,
  artists: Array<string>,
|}
export type SongsState = {|
  nonce: number,
  songToPlay: ?SongToPlayState,
  selected: ?SongsStateSelected,
  songControls: ?CurrentSongControlsState,
  songsListToPlay: ?SongsListToPlayState,
|}

export type CurrentSongControlsState = {|
  mute: boolean,
  volume: number,
  pause: boolean,
|}

export type SongsListToPlayState = {|
  songsList: Array<File>,
|}

const defaultState: SongsState = {
  nonce: 0,
  selected: null,
  songToPlay: null,
  songsListToPlay: null,
  songControls: { mute: false, volume: 50, pause: true },
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
    [SONG_TO_PLAY]: (state: SongsState, { payload: songToPlay }) => ({
      ...state,
      songToPlay,
    }),
    [SONGS_LIST_TO_PLAY]: (state: SongsState, { payload: songsListToPlay }) => ({
      ...state,
      songsListToPlay,
    }),
    [CURRENT_SONG_CONTROLS]: (state: SongsState, { payload: songControls }) => ({
      ...state,
      songControls: {
        ...state.songControls,
        ...songControls,
      },
    }),
  },
  defaultState,
)
