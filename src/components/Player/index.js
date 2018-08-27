// @flow

import * as React from 'react'
import { connect } from 'react-redux'

import db from '~/db'
import services from '~/services'
import type { File } from '~/types'
import type { UserAuthorization } from '~/redux/user'
import type { SongsStateFields } from '~/redux/songs'
import { playNext, playPrevious, songPlay, songPause } from '~/redux/songs'

import PlayerControlsRepeat from './PlayerControlsRepeat'
import PlayerControlsVolume from './PlayerControlsVolume'
import PlayerControlDuration from './PlayerControlsDuration'

import '~/css/slider.css'
import '~/css/player.css'
import cover from '../../static/img/album-cover.jpg'

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
  internalPause() {
    this.audioElement.pause()
  }
  internalPlay() {
    this.audioElement.play()
  }

  render() {
    const { songs } = this.props
    const { activeSong } = this.state

    let songName = activeSong ? activeSong.filename : ''
    let songArtist = activeSong ? 'Unknown' : ''
    if (activeSong) {
      if (activeSong.meta && activeSong.meta.name) {
        songName = activeSong.meta.name
      }
      if (activeSong.meta && activeSong.meta.artists_original) {
        songArtist = activeSong.meta.artists_original
      }
    }

    return (
      <div className="section-player">
        <div className="section-player-cover" style={{ backgroundImage: `url(${cover})` }}>
          <div className="section-song-description flex-row space-between">
            <div className="song-details">
              <h1 className="song-title">{activeSong ? songName : ''}</h1>
              <h4 className="song-artist">{activeSong ? songArtist : ''}</h4>
            </div>
          </div>
          <div className="section-player-controls align-center space-between">
            <div className="section-player-btns align-center">
              <button onClick={this.playPrevious}>
                <i title="Previous" className="material-icons player-material-icons">
                  fast_rewind
                </i>
              </button>
              <button onClick={this.playPause}>
                <i
                  title={songs.songState === 'playing' ? 'Pause' : 'Play'}
                  className="material-icons player-material-icons play-btn"
                >
                  {songs.songState === 'playing' ? 'pause_circle_outline' : 'play_circle_outline'}
                </i>
              </button>
              <button onClick={this.playNext}>
                <i title="Previous" className="material-icons player-material-icons">
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
      </div>
    )
  }
}

export default connect(({ songs, user }) => ({
  songs,
  activeSong: songs.playlist[songs.songIndex] || null,
  authorizations: user.authorizations.toArray(),
}))(Player)
