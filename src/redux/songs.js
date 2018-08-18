// @flow

import { createAction, handleActions } from 'redux-actions'

const INCREMENT_NONCE = 'SONGS/INCREMENT_NONCE'
const SET_SONG_PLAYLIST = 'SONGS/SET_SONG_PLAYLIST'
const SET_SONG_REPEAT = 'SONGS/SET_SONG_REPEAT'
const SET_SONG_VOLUME = 'SONG/SET_SONG_VOLUME'
const SET_SONG_MUTE = 'SONG/SET_SONG_MUTE'

const PLAY_NEXT = 'SONGS/PLAY_NEXT'
const PLAY_PREVIOUS = 'SONGS/PLAY_PREVIOUS'

const SONG_PLAY = 'SONGS/SONG_PLAY'
const SONG_PAUSE = 'SONGS/SONG_PAUSE'
const SONG_STOP = 'SONG/SONG_STOP'

export const incrementNonce = createAction(INCREMENT_NONCE)
export const setSongPlaylist = createAction(SET_SONG_PLAYLIST)
export const setSongRepeat = createAction(SET_SONG_REPEAT)
export const setSongVolume = createAction(SET_SONG_VOLUME)
export const setSongMute = createAction(SET_SONG_MUTE)

export const playNext = createAction(PLAY_NEXT)
export const playPrevious = createAction(PLAY_PREVIOUS)

export const songPlay = createAction(SONG_PLAY)
export const songPause = createAction(SONG_PAUSE)
export const songStop = createAction(SONG_STOP)

export type SongsState = {|
  nonce: number,
  songs: Array<number>,
  songsRepeat: 'all' | 'single' | 'none',
  songState: 'paused' | 'stopped' | 'playing',
  songIndex: number,
  songVolume: number,
  mute: boolean,
|}

const defaultState: SongsState = {
  nonce: 0,
  songs: [],
  songsRepeat: 'none',
  songState: 'stopped',
  songIndex: -1,
  songVolume: 50,
  mute: false,
}

export default handleActions(
  {
    [INCREMENT_NONCE]: (state: SongsState) => ({
      ...state,
      nonce: state.nonce + 1,
    }),
    [SET_SONG_PLAYLIST]: (state: SongsState, { payload }) => ({
      ...state,
      songs: payload,
      songState: 'playing',
      songIndex: 0,
    }),
    [SET_SONG_REPEAT]: (state: SongsState, { payload }) => ({
      ...state,
      songsRepeat: payload,
    }),
    [SET_SONG_VOLUME]: (state: SongsState, { payload }) => ({
      ...state,
      songVolume: payload,
    }),
    [SET_SONG_MUTE]: (state: SongsState, { payload }) => ({
      ...state,
      mute: payload,
    }),
    [PLAY_NEXT]: (state: SongsState) => ({
      ...state,
      songIndex: (state.songIndex + 1) % state.songs.length,
    }),
    [PLAY_PREVIOUS]: (state: SongsState, { payload }) => {
      let newIndex = state.songIndex - 1
      if (newIndex < 0) {
        newIndex = state.songs.length - 1
      }
      return {
        ...state,
        songIndex: newIndex,
      }
    },
    [SONG_PLAY]: (state: SongsState) => ({
      ...state,
      songState: 'playing',
    }),
    [SONG_PAUSE]: (state: SongsState) => ({
      ...state,
      songState: 'paused',
    }),
    [SONG_STOP]: (state: SongsState) => ({
      ...state,
      songState: 'stopped',
    }),
  },
  defaultState,
)
