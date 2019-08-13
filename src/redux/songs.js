// @flow

import { createAction } from 'redux-actions'

import {
    INCREMENT_NONCE,
    SET_SONG_PLAYLIST,
    ADD_TO_RECENTLY_PLAYED,
    SET_SONG_REPEAT,
    SET_SONG_VOLUME,
    SET_SONG_MUTE,
    PLAY_NEXT,
    PLAY_LATER,
    PLAY_PREVIOUS,
    SONG_PLAY,
    SONG_PAUSE,
    SHOW_SONG_CONTEXTMENU
} from '~/common/types'


export type RepeatMode = 'all' | 'single' | 'none'

export const incrementNonce = createAction(INCREMENT_NONCE)
export const setSongPlaylist = createAction(SET_SONG_PLAYLIST)
export const addToRecentlyPlayed = createAction(ADD_TO_RECENTLY_PLAYED)
export const setSongRepeat = createAction(SET_SONG_REPEAT)
export const setSongVolume = createAction(SET_SONG_VOLUME)
export const setSongMute = createAction(SET_SONG_MUTE)

export const playNext = createAction(PLAY_NEXT)
export const playLater = createAction(PLAY_LATER)
export const playPrevious = createAction(PLAY_PREVIOUS)

export const songPlay = createAction(SONG_PLAY)
export const songPause = createAction(SONG_PAUSE)

export const showSongContextMenu = createAction(SHOW_SONG_CONTEXTMENU)

export type SongsStateFields = {|
  nonce: number,
  playlist: Array<number>,
  songsRepeat: RepeatMode,
  recentlyPlayed: Array<number>,
  songState: 'paused' | 'playing',
  songIndex: number,
  songVolume: number,
  songMuted: boolean,
  showContextMenu: boolean,
|}

type SongsState = SongsStateFields

type ActionState = {|
    type: string,
    payload: any
|}

const INITIAL_STATE: SongsState = {
      nonce: 0,
      playlist: [],
      songsRepeat: 'none',
      songState: 'paused',
      recentlyPlayed: [],
      songIndex: -1,
      songVolume: 100,
      songMuted: false,
      showContextMenu: false,
}

export default (state: SongsState = INITIAL_STATE, action: ActionState) => {
    switch (action.type) {
        case INCREMENT_NONCE:
            return {...state, nonce: state.nonce + 1}
        case SET_SONG_PLAYLIST:
            return {...state, playlist: action.payload.songs, songState: 'playing', songIndex: action.payload.index }
        case ADD_TO_RECENTLY_PLAYED: {
          const recent: Array<number> = state.recentlyPlayed.slice()
          const index = recent.indexOf(action.payload)
          if (index !== -1) {
            recent.splice(index, 1)
          }
          recent.unshift(action.payload)
          return { ...state, recentlyPlayed: recent }
        }
        case SET_SONG_REPEAT:
            return { ...state, songsRepeat: action.payload }
        case SET_SONG_VOLUME:
            return { ...state, songVolume: action.payload }
        case PLAY_NEXT:
            return { ...state, songIndex: (state.songIndex + 1) % state.playlist.length }
        case PLAY_LATER: {
          const playList: Array<number> = state.playlist.slice()
          action.payload.forEach(id => {
            const index = playList.indexOf(id)
            if (index !== -1) {
              playList.splice(index, 1)
            }
            playList.splice(state.songIndex + 1, 0, id)
          })
          return { ...state, playlist: playList }
        }
        case PLAY_PREVIOUS: {
            let newIndex = state.songIndex - 1
            if (newIndex < 0) {
              newIndex = state.playlist.length - 1
            }
            return { ...state, songIndex: newIndex }
        }
        case SONG_PLAY:
            return { ...state, songState: "playing" }
        case SONG_PAUSE:
            return { ...state, songState: "paused" }
        case SET_SONG_MUTE:
            return { ...state, songMuted: !!action.payload }
        case SHOW_SONG_CONTEXTMENU:
            return { ...state, showContextMenu: action.payload.showContextMenu }
        default:
            return state;
    }
}