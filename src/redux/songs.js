// @flow

import { createAction, handleActions } from 'redux-actions'
import { Record, type RecordOf, type RecordFactory } from 'immutable'

const INCREMENT_NONCE = 'SONGS/INCREMENT_NONCE'
const SET_SONG_PLAYLIST = 'SONGS/SET_SONG_PLAYLIST'
const SET_SONG_REPEAT = 'SONGS/SET_SONG_REPEAT'
const SET_SONG_VOLUME = 'SONGS/SET_SONG_VOLUME'
const SET_SONG_MUTE = 'SONGS/SET_SONG_MUTE'

const PLAY_NEXT = 'SONGS/PLAY_NEXT'
const PLAY_PREVIOUS = 'SONGS/PLAY_PREVIOUS'

const SONG_PLAY = 'SONGS/SONG_PLAY'
const SONG_PAUSE = 'SONGS/SONG_PAUSE'

export type RepeatMode = 'all' | 'single' | 'none'

export const incrementNonce = createAction(INCREMENT_NONCE)
export const setSongPlaylist = createAction(SET_SONG_PLAYLIST)
export const setSongRepeat = createAction(SET_SONG_REPEAT)
export const setSongVolume = createAction(SET_SONG_VOLUME)
export const setSongMute = createAction(SET_SONG_MUTE)

export const playNext = createAction(PLAY_NEXT)
export const playPrevious = createAction(PLAY_PREVIOUS)

export const songPlay = createAction(SONG_PLAY)
export const songPause = createAction(SONG_PAUSE)

export type SongsStateFields = {|
  nonce: number,
  playlist: Array<number>,
  songsRepeat: RepeatMode,
  songState: 'paused' | 'playing',
  songIndex: number,
  songVolume: number,
  songMuted: boolean,
|}

export type SongsState = RecordOf<SongsStateFields>
const createSongsState: RecordFactory<SongsStateFields> = Record({
  nonce: 0,
  playlist: [],
  songsRepeat: 'none',
  songState: 'paused',
  songIndex: -1,
  songVolume: 50,
  songMuted: false,
})

export default handleActions(
  {
    [INCREMENT_NONCE]: (state: SongsState) => state.merge({ nonce: state.nonce + 1 }),
    [SET_SONG_PLAYLIST]: (state: SongsState, { payload }) =>
      state.merge({
        playlist: payload.songs,
        songState: 'playing',
        songIndex: payload.index,
      }),
    [SET_SONG_REPEAT]: (state: SongsState, { payload }) =>
      state.merge({
        songsRepeat: payload,
      }),
    [SET_SONG_VOLUME]: (state: SongsState, { payload }) =>
      state.merge({
        songVolume: payload,
      }),
    [PLAY_NEXT]: (state: SongsState) =>
      state.merge({
        songIndex: (state.songIndex + 1) % state.playlist.length,
      }),
    [PLAY_PREVIOUS]: (state: SongsState) => {
      let newIndex = state.songIndex - 1
      if (newIndex < 0) {
        newIndex = state.playlist.length - 1
      }
      return state.merge({
        songIndex: newIndex,
      })
    },
    [SONG_PLAY]: (state: SongsState) =>
      state.merge({
        songState: 'playing',
      }),
    [SONG_PAUSE]: (state: SongsState) =>
      state.merge({
        songState: 'paused',
      }),
  },
  createSongsState(),
)
