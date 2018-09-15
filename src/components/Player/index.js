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

import '~/styles/slider.less'
import '~/styles/player.less'
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
    let promise = Promise.resolve()
    if (this.props.activeSong !== activeSong) {
      if (this.props.activeSong) {
        this.internalPause()
      }
      if (activeSong) {
        promise = this.loadSong(activeSong, songs.songState)
      } else {
        this.internalPause()
        this.setState({ activeSong: null })
      }
    } else if (this.props.songs.songState !== songs.songState) {
      if (songs.songState === 'playing') {
        promise.then(() => this.internalPlay())
      } else {
        promise.then(() => this.internalPause())
      }
      if (this.props.songs.nonce !== songs.nonce && activeSong) {
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
    const { songsRepeat, songIndex, playlist } = this.props.songs
    if (songsRepeat === 'single') {
      this.audioElement.play()
    } else {
      const isLastSong = songIndex === playlist.length - 1
      if (!isLastSong || songsRepeat === 'all') {
        this.props.dispatch(playNext())
      }
    }
  }

  playPrevious = () => {
    this.props.dispatch(playPrevious())
  }
  playNext = () => {
    this.props.dispatch(playNext())
  }
  playPause = () => {
    const { songs } = this.props
    this.props.dispatch(songs.songState === 'playing' ? songPause() : songPlay())
  }

  audioElement: HTMLAudioElement

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

  updateDuration = () => {
    const song = this.state.activeSong
    if (song) {
      this.props.dispatch(addToRecentlyPlayed(song.id))
      if (!song.duration) {
        db.songs.update(song.id, {
          duration: this.audioElement.duration,
        })
        this.props.dispatch(incrementNonce())
      }
    }
  }

  internalPause() {
    this.audioElement.pause()
  }
  internalPlay() {
    this.audioElement.play()
  }

  deleteSong = (e: SyntheticEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (this.state.activeSong) {
      deleteSongsFromLibrary([this.state.activeSong.id])
      this.props.dispatch(playNext())
      this.props.dispatch(incrementNonce())
    }
  }

  render() {
    const { songs } = this.props
    const { activeSong } = this.state

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
      <div className="section-player flex-column">
        <div className="flex-row space-between">
          <div className="flex-row section-player-cover">
            <img src={coverImg} alt={cover} />
            <div>
              <h1 className="btn-white">{activeSong ? songName : ''}</h1>
              <h3 className="btn-white">{activeSong ? songArtist : ''}</h3>
            </div>
          </div>
          <button onClick={this.deleteSong}>
            <i title="Delete from Library" className="material-icons btn-white">
              delete
            </i>
          </button>
        </div>
        <div className="section-player-controls align-center space-between">
          <div className="section-player-btns align-center">
            <button onClick={this.playPrevious}>
              <i title="Previous" className="material-icons btn-white">
                fast_rewind
              </i>
            </button>
            <button onClick={this.playPause}>
              <i title={songs.songState === 'playing' ? 'Pause' : 'Play'} className="material-icons btn-white">
                {songs.songState === 'playing' ? 'pause_circle_outline' : 'play_circle_outline'}
              </i>
            </button>
            <button onClick={this.playNext}>
              <i title="Previous" className="material-icons btn-white">
                fast_forward
              </i>
            </button>
          </div>
          <div className="section-progress align-center space-between">
            <PlayerControlDuration audioElement={this.audioElement} />
          </div>
          <div className="section-volume align-center">
            <PlayerControlsVolume audioElement={this.audioElement} />
            <PlayerControlsRepeat />
          </div>
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
