// @flow

import React from 'react'
import debounce from 'lodash/debounce'
import { connect } from 'react-redux'

import db from '~/db'
import services from '~/services'
import { humanizeDuration } from '~/common/songs'
import type { UserAuthorization } from '~/redux/user'
import {
  setSongRepeat,
  setSongVolume,
  setSongMute,
  playNext,
  playPrevious,
  songPlay,
  songPause,
  songStop,
} from '~/redux/songs'

import Popup from './Popup'
import Dropdown from './Dropdown'
import SubDropdown from './SubDropdown'

import cover from '../static/img/album-cover.jpg'

type Props = {|
  authorizations: Array<UserAuthorization>,
  songs: Array<number>,
  songIndex: number,
  songsRepeat: string,
  volume: number,
  mute: boolean,
  songState: string,

  setSongRepeat: typeof setSongRepeat,
  setSongVolume: typeof setSongVolume,
  setSongMute: typeof setSongMute,
  playNext: typeof playNext,
  playPrevious: typeof playPrevious,
  songPlay: () => void,
  songPause: () => void,
  songStop: () => void,
|}
type State = {|
  duration: number,
  currentTime: number,
  activeSong: Object | null,
  progressbarWidth: number,
  showPlaylistPopup: number | null,
|}

class Player extends React.Component<Props, State> {
  source = null
  volume = null
  audioContext = new AudioContext()
  setInterval: IntervalID

  state = {
    duration: 0,
    currentTime: 0,
    activeSong: null,
    progressbarWidth: 0,
    showPlaylistPopup: null,
  }

  async componentDidMount() {
    const currentSong = this.props.songs[this.props.songIndex]
    if (currentSong) {
      this.playSong(currentSong)
    }
    this.setInterval = setInterval(() => {
      this.updateCurrentTime()
    }, 1000)
    document.addEventListener('keypress', this.handleBodyKeypress)
  }

  stop() {
    if (this.source) {
      this.source.stop(0)
    }
  }
  async componentWillReceiveProps(nextProps) {
    const newSong = nextProps.songs[nextProps.songIndex]
    const oldSong = this.props.songs[this.props.songIndex]

    if (oldSong && !newSong) {
      this.stop()
    } else if (oldSong !== newSong) {
      this.stop()
      this.clearCurrentTime()
      this.playSong(newSong)
      this.setInterval = setInterval(() => {
        this.updateCurrentTime()
      }, 1000)
    }
  }

  componentWillUnmount() {
    this.clearCurrentTime()
    document.removeEventListener('keypress', this.handleBodyKeypress)
  }

  handleBodyKeypress = (e: KeyboardEvent) => {
    e.preventDefault()
    if (e.keyCode == 32) {
      this.pauseSong()
    }
  }

  updateCurrentTime = () => {
    if (this.props.songState === 'paused') {
      this.setState(prevState => ({
        currentTime: prevState.currentTime,
      }))
      return
    } else if (this.state.currentTime >= this.state.duration - 1) {
      if (this.props.songs.length > 1) {
        this.playNext()
      }
      this.clearCurrentTime()
      return
    }
    this.setState(prevState => ({
      currentTime: prevState.currentTime + 1,
      progressbarWidth: prevState.currentTime / prevState.duration * 100,
    }))
  }

  clearCurrentTime = () => {
    this.setState({ currentTime: 0, progressbarWidth: 0 })
    clearInterval(this.setInterval)
  }

  showPlaylistPopupInput = (e: SyntheticInputEvent<HTMLInputElement>) => {
    e.preventDefault()
    this.setState({ showPlaylistPopup: Date.now() })
  }

  handleVolumeChange = (event: SyntheticInputEvent<HTMLInputElement>) => {
    const volume = parseInt(event.target.value, 10)
    const songVolume = this.volume
    if (songVolume) {
      songVolume.gain.value = volume / 100
      this.props.setSongVolume(volume)
    }
  }

  handleMuteVolume = () => {
    if (this.volume) {
      if (this.props.mute) {
        this.volume.gain.setValueAtTime(this.props.volume / 100, this.audioContext.currentTime)
        this.props.setSongMute(false)
        return
      }
      this.volume.gain.setValueAtTime(0, this.audioContext.currentTime)
      this.props.setSongMute(true)
    }
  }

  applyProgressbarChange = debounce(async (value: number) => {
    // if (this.source) {
    //   const songID = this.props.songs[0]
    //   const song = await db.songs.get(songID)
    //
    //   this.playSong(song, value)
    // }
  }, 500)

  handleProgressbarChange = (event: SyntheticInputEvent<HTMLInputElement>) => {
    if (this.source) {
      this.source.stop(0)
    }
    const numeric = parseInt(event.target.value, 10)
    const duration = this.state.duration
    this.setState({ currentTime: numeric, progressbarWidth: numeric / duration * 100 })
    this.applyProgressbarChange(numeric)
  }

  playSong = async (songId: number) => {
    const song = await db.songs.get(songId)
    const { authorizations } = this.props
    if (!authorizations.length) {
      console.warn('No authorizations found')
      return
    }
    this.setState({ activeSong: song })

    this.source = this.audioContext.createBufferSource()
    this.volume = this.audioContext.createGain()
    this.volume.gain.value = this.props.volume / 100
    if (this.source) {
      this.source.connect(this.volume)
    }
    this.volume.connect(this.audioContext.destination)

    authorizations.forEach(async authorization => {
      const service = services.find(item => item.name === authorization.service)
      if (!service) {
        console.warn('Service not found for authorization', authorization)
        return
      }

      const response = await service.getFile(authorization, song.sourceId)

      const buffer = await response.arrayBuffer()

      const decodedData = await this.audioContext.decodeAudioData(buffer)
      if (this.source) {
        this.source.buffer = decodedData
        this.source.start(0)
        this.setState({ duration: decodedData.duration })
        this.props.songPlay()
      }
    })
  }

  pauseSong = () => {
    if (this.audioContext.state === 'running') {
      this.audioContext.suspend()
      this.props.songPause()
    } else if (this.audioContext.state === 'suspended') {
      this.audioContext.resume()
      this.props.songPlay()
    }
  }

  playNext = () => {
    this.props.playNext()
  }
  playPrevious = () => {
    this.props.playPrevious()
  }

  // hadleRepeatSong = () => {
  //   if (this.source && this.props.songControls.repeat) {
  //     this.source.loop = false
  //     this.props.currentSongControls({ repeat: false })
  //     return
  //   }
  //   if (this.source) {
  //     this.source.loop = true
  //     this.props.currentSongControls({ repeat: true })
  //   }
  // }

  render() {
    const { showPlaylistPopup, duration, currentTime, progressbarWidth, activeSong } = this.state
    const { volume, mute, songState } = this.props
    const name =
      activeSong && activeSong.meta && typeof activeSong.meta.name !== 'undefined'
        ? activeSong.meta.name
        : activeSong && activeSong.filename.replace('.mp3', '')
    const artist =
      activeSong && activeSong.meta && activeSong.meta.artists.length === 0
        ? 'Unknown'
        : activeSong && activeSong.meta && activeSong.meta.artists.join(', ')

    return (
      <div className="section-player">
        {showPlaylistPopup ? (
          <Popup hash={showPlaylistPopup.toString()}>
            <input type="text" placeholder="Choose name" />
            <button className="btn-blue">Save</button>
          </Popup>
        ) : (
          <div />
        )}
        <div className="section-player-cover" style={{ backgroundImage: `url(${cover})` }}>
          <div className="section-song-description flex-row space-between">
            <div className="song-details">
              <h1 className="song-title">{name !== null ? name : 'Empty'}</h1>
              <h4 className="song-artist">{artist !== null ? artist : 'Empty'}</h4>
            </div>
            <Dropdown>
              <div className="align-center space-between sub-dropdown-trigger">
                <a>Add to Playlist</a>
                <SubDropdown>
                  <a onClick={this.showPlaylistPopupInput} className="dropdown-option">
                    New Playlist
                  </a>
                  <a className="dropdown-option">90's</a>
                  <a className="dropdown-option">Peace of Mind</a>
                  <a className="dropdown-option">Rock n Roll</a>
                </SubDropdown>
              </div>
              <a className="dropdown-option">Play Next</a>
              <a className="dropdown-option">Play Later</a>
              <a className="dropdown-option">Delete from Library</a>
            </Dropdown>
          </div>
          <div className="section-player-controls align-center space-between">
            <div className="section-player-btns align-center">
              <i
                title="Previous"
                className={`material-icons ${this.props.songs.length <= 1 ? 'inactive' : ''}`}
                onClick={this.playPrevious}
              >
                fast_rewind
              </i>
              {songState === 'paused' ? (
                <i title="Play" className="material-icons play-btn" onClick={this.pauseSong}>
                  play_circle_outline
                </i>
              ) : (
                <i title="Pause" className="material-icons play-btn" onClick={this.pauseSong}>
                  pause_circle_outline
                </i>
              )}
              <i
                title="Next"
                className={`material-icons ${this.props.songs.length <= 1 ? 'inactive' : ''}`}
                onClick={this.playNext}
              >
                fast_forward
              </i>
            </div>
            <div className="section-progress align-center space-between">
              <span>{humanizeDuration(currentTime)}</span>
              <div className="progressbar">
                <div className="progress-fill" style={{ width: `${progressbarWidth + 0.5}%` }} />
                <input type="range" onInput={this.handleProgressbarChange} value={currentTime} min={0} max={duration} />
              </div>
              <span>{humanizeDuration(duration)}</span>
            </div>
            <div className="section-volume align-center">
              {mute ? (
                <i title="Volume" onClick={this.handleMuteVolume} className="material-icons">
                  volume_off
                </i>
              ) : volume === 0 ? (
                <i title="Volume" onClick={this.handleMuteVolume} className="material-icons">
                  volume_off
                </i>
              ) : volume <= 40 ? (
                <i title="Volume" onClick={this.handleMuteVolume} className="material-icons">
                  volume_down
                </i>
              ) : (
                <i title="Volume" onClick={this.handleMuteVolume} className="material-icons">
                  volume_up
                </i>
              )}

              <div className="volume-progressbar">
                <div className="progress-fill" style={{ width: `${volume}%` }} />
                <input onChange={this.handleVolumeChange} title="Volume" type="range" value={volume} min="0" max="100" />
              </div>
              <i title="Repeat" className="material-icons">
                sync
              </i>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(
  state => ({
    authorizations: state.user.authorizations.toArray(),
    songs: state.songs.songs,
    songsRepeat: state.songs.songsRepeat,
    volume: state.songs.songVolume,
    mute: state.songs.mute,
    songIndex: state.songs.songIndex,
    songState: state.songs.songState,
  }),
  { setSongRepeat, setSongVolume, setSongMute, playNext, playPrevious, songPlay, songPause, songStop },
)(Player)
