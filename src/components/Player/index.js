// @flow

import * as React from 'react'
import connect from '~/common/connect'

import db from '~/db'
import services from '~/services'
import type { File } from '~/types'
import type { UserAuthorization } from '~/redux/user'
import type { SongsStateFields } from '~/redux/songs'
import { deleteSongsFromLibrary } from '~/common/songs'
import { playNext, playPrevious, songPlay, songPause, incrementNonce, addToRecentlyPlayed } from '~/redux/songs'

import flex from '~/less/flex.less'
import button from '~/less/button.less'
import player from '~/less/player.less'
import cover from '~/static/img/alter-img.png'
import PlayerControlsRepeat from './PlayerControlsRepeat'
import PlayerControlsVolume from './PlayerControlsVolume'
import PlayerControlDuration from './PlayerControlsDuration'

type Props = {|
  songs: SongsStateFields,
  dispatch: Function,
  activeSong: number,
  authorizations: Array<UserAuthorization>,
|}
type State = {|
  activeSong: ({ id: number } & File) | null,
|}

class Player extends React.Component<Props, State> {
  constructor(props, context) {
    super(props, context)
    this.audioElement = document.createElement('audio')
    this.audioElement.addEventListener('ended', this.handleEnded)
    this.audioElement.addEventListener('canplay', () => {
      this.updateDuration()
    })
  }

  state = {
    activeSong: null,
  }

  componentDidMount() {
    const { activeSong, songs } = this.props
    if (activeSong) {
      this.loadSong(activeSong, songs.songState).catch(console.error)
    }
    document.addEventListener('keypress', this.handleBodyKeypress)
  }

  componentWillReceiveProps({ activeSong, songs }) {
    const { activeSong: currentActiveSong, songs: currentSongs } = this.props

    let promise = Promise.resolve()
    if (currentActiveSong !== activeSong) {
      if (currentActiveSong) {
        this.internalPause()
      }
      if (activeSong) {
        promise = this.loadSong(activeSong, songs.songState)
      } else {
        this.internalPause()
        this.setState({ activeSong: null })
      }
    } else if (currentSongs.songState !== songs.songState) {
      if (songs.songState === 'playing') {
        promise.then(() => this.internalPlay())
      } else {
        promise.then(() => this.internalPause())
      }
      if (currentSongs.nonce !== songs.nonce && activeSong) {
        promise = promise.then(() => this.loadSong(activeSong, songs.songState))
      }
    }
    promise.catch(console.error)
  }

  componentWillUnmount() {
    document.removeEventListener('keypress', this.handleBodyKeypress)
  }

  handleBodyKeypress = (e: KeyboardEvent) => {
    if (document.activeElement === document.body && e.keyCode === 32) {
      e.preventDefault()
      this.playPause()
    }
  }
  handleEnded = () => {
    const { dispatch, songs } = this.props
    const { songsRepeat, songIndex, playlist } = songs
    if (songsRepeat === 'single') {
      this.audioElement.play()
    } else {
      const isLastSong = songIndex === playlist.length - 1
      if (!isLastSong || songsRepeat === 'all') {
        dispatch(playNext())
      }
    }
  }

  playPause = () => {
    const { songs, dispatch } = this.props
    dispatch(songs.songState === 'playing' ? songPause() : songPlay())
  }

  updateDuration = () => {
    const { dispatch } = this.props
    const { activeSong } = this.state
    if (activeSong) {
      dispatch(addToRecentlyPlayed(activeSong.id))
      if (!activeSong.duration) {
        db.songs.update(activeSong.id, {
          duration: this.audioElement.duration,
        })
        dispatch(incrementNonce())
      }
    }
  }

  deleteSong = (e: SyntheticEvent<HTMLButtonElement>) => {
    e.preventDefault()
    const { dispatch } = this.props
    const { activeSong } = this.state
    if (activeSong) {
      deleteSongsFromLibrary([activeSong.id])
      dispatch(playNext())
      dispatch(incrementNonce())
    }
  }
  internalPlay() {
    this.audioElement.play()
  }
  internalPause() {
    this.audioElement.pause()
  }

  async loadSong(songId: number, songState) {
    const { authorizations } = this.props
    const { activeSong: lastActiveSong } = this.state
    const activeSong = await db.songs.get(songId)

    this.setState({ activeSong })
    if (lastActiveSong && lastActiveSong.id === activeSong.id) {
      // Just update title etc and return
      return
    }

    const authorization = authorizations.find(
      entry => entry.service === activeSong.source && entry.uid === activeSong.sourceUid,
    )
    if (!authorization) {
      console.error(`Authorization not found for song#${activeSong.id}`)
      return
    }
    const service = services.find(entry => entry.name === activeSong.source)
    if (!service) {
      console.error(`Service not found for song#${activeSong.id}`)
      return
    }
    const responseBlob = await (await service.getFile(authorization, activeSong.sourceId)).blob()
    this.audioElement.src = URL.createObjectURL(responseBlob)

    if (songState === 'playing') {
      this.internalPlay()
    }
  }

  audioElement: HTMLAudioElement

  render() {
    const { activeSong } = this.state
    const { songs, dispatch } = this.props

    let songName = activeSong ? activeSong.filename : ''
    let coverImg
    let songArtist = activeSong ? 'Unknown' : ''
    if (activeSong) {
      if (activeSong.meta && activeSong.meta.name) {
        songName = activeSong.meta.name
      }
      if (activeSong.meta && activeSong.meta.artists_original) {
        songArtist = activeSong.meta.artists_original
      }

      if (activeSong.artwork && activeSong.artwork.album && activeSong.artwork.album.uri !== null) {
        coverImg = activeSong.artwork.album.uri
      } else {
        coverImg = cover
      }
    }

    return (
      <div className={`${player.section_player} ${flex.row} ${flex.baseline}`}>
        <div className={`${player.right_btns} ${flex.align_center}`}>
          <button type="button" className={`${button.btn} ${button.btn_round}`} onClick={() => dispatch(playPrevious())}>
            <i title="Previous" className="material-icons">
              fast_rewind
            </i>
          </button>
          <button
            type="button"
            className={`${button.btn} ${button.btn_round} ${songs.songState === 'playing' ? 'active' : ''}`}
            onClick={this.playPause}
          >
            <i title={songs.songState === 'playing' ? 'Pause' : 'Play'} className="material-icons">
              {songs.songState === 'playing' ? 'pause_circle_outline' : 'play_circle_outline'}
            </i>
          </button>
          <button type="button" className={`${button.btn} ${button.btn_round}`} onClick={() => dispatch(playNext())}>
            <i title="Next" className="material-icons">
              fast_forward
            </i>
          </button>
        </div>
        <div className={`${player.section_progress} ${flex.align_center} ${flex.space_around}`}>
          <img className={player.img} src={coverImg} alt={cover} />
          <PlayerControlDuration
            audioElement={this.audioElement}
            title={activeSong ? songName : ''}
            artist={activeSong ? songArtist : ''}
          />
        </div>
        <div className={`${player.section_volume} ${flex.align_center}`}>
          <PlayerControlsVolume audioElement={this.audioElement} />
          <PlayerControlsRepeat />
          <button type="button" className={`${button.btn} ${button.btn_round}`} onClick={this.deleteSong}>
            <i title="Delete from Library" className="material-icons">
              delete
            </i>
          </button>
        </div>
      </div>
    )
  }
}

export default connect(({ songs, user }) => ({
  songs,
  activeSong: songs.playlist[songs.songIndex] || null,
  authorizations: user.authorizations.toArray(),
}))(Player)
