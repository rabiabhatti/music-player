// @flow

import * as React from 'react'
import debounce from 'lodash/debounce'
import { connect } from 'react-redux'

import db from '~/db'
import services from '~/services'
import { humanizeDuration, addSongsToPlaylist } from '~/common/songs'
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
  localVolume: number,
  activeSong: Object | null,
  progressbarWidth: number,
  playlists: Array<Object> | null,
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
    playlists: null,
    localVolume: 50,
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
    const playlists = await db.playlists.toArray()
    this.setState({ playlists: playlists })
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
      this.clearCurrentTime()
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
    if (document.activeElement === document.body && e.keyCode == 32) {
      e.preventDefault()
      this.pauseSong()
    }
  }

  updateCurrentTime = () => {
    if (this.props.songState === 'paused' || this.props.songState === 'stopped') {
      this.setState(prevState => ({
        currentTime: prevState.currentTime,
      }))
      return
    } else if (this.state.currentTime >= this.state.duration - 1) {
      this.setState({ currentTime: 0, progressbarWidth: 0 })
      this.props.songStop()
      if (this.props.songsRepeat === 'single' || (this.props.songs.length === 1 && this.props.songsRepeat === 'all')) {
        this.playSong(this.props.songs[this.props.songIndex])
        return
      } else if (
        (this.props.songs.length > 1 && this.props.songIndex !== this.props.songs.length - 1) ||
        (this.props.songsRepeat === 'all' && this.props.songIndex === this.props.songs.length - 1)
      ) {
        this.playNext()
        return
      }
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
    this.setState({ localVolume: volume })
    this.applyVolumeChange(volume)
  }

  applyVolumeChange = debounce((volume: number) => {
    if (this.volume) {
      this.volume.gain.value = volume / 100
      this.props.setSongVolume(volume)
    }
  }, 50)

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
    this.stop()
    const song = this.props.songs[this.props.songIndex]
    this.playSong(song, value)
  }, 500)

  handleProgressbarChange = (event: SyntheticInputEvent<HTMLInputElement>) => {
    const numeric = parseInt(event.target.value, 10)
    const duration = this.state.duration
    this.setState({ currentTime: numeric, progressbarWidth: numeric / duration * 100 })
    this.applyProgressbarChange(numeric)
  }

  playSong = async (songId: number, time: ?number) => {
    const song = await db.songs.get(songId)
    const { authorizations } = this.props
    if (!authorizations.length) {
      console.warn('No authorizations found')
      return
    }
    this.setState({ activeSong: song })

    this.source = this.audioContext.createBufferSource()
    this.volume = this.audioContext.createGain()
    if (this.props.mute) {
      this.volume.gain.value = 0
    } else {
      this.volume.gain.value = this.props.volume / 100
    }
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
      const localSource = this.source
      if (localSource) {
        localSource.buffer = decodedData
        if (time) {
          localSource.start(this.audioContext.currentTime, time, this.state.duration)
          if (this.audioContext.state === 'suspended') {
            this.audioContext.resume()
          }
        } else {
          localSource.start(0)
        }
        this.setState({ duration: decodedData.duration })
        this.props.songPlay()
      }
    })
  }

  pauseSong = () => {
    if (this.props.songState === 'stopped' && this.audioContext.state === 'running') {
      this.playSong(this.props.songs[this.props.songIndex])
    } else if (this.audioContext.state === 'running') {
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

  render() {
    const { showPlaylistPopup, duration, currentTime, progressbarWidth, activeSong, localVolume, playlists } = this.state
    const { volume, mute, songState, songsRepeat, songs } = this.props
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
        {showPlaylistPopup && (
          <Popup hash={showPlaylistPopup.toString()} songsIds={[this.props.songs[this.props.songIndex]]} />
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
                  {playlists &&
                    activeSong &&
                    playlists.map(playlist => (
                      <a
                        key={playlist.id}
                        className="dropdown-option"
                        onClick={() => addSongsToPlaylist([activeSong.id], playlist.id)}
                      >
                        {playlist.name}
                      </a>
                    ))}
                </SubDropdown>
              </div>
              <a className="dropdown-option" onClick={this.playNext}>
                Play Next
              </a>
              <a className="dropdown-option">Play Later</a>
              <a className="dropdown-option">Delete from Library</a>
            </Dropdown>
          </div>
          <div className="section-player-controls align-center space-between">
            <div className="section-player-btns align-center">
              <i
                title="Previous"
                className={`material-icons ${songs.length <= 1 ? 'inactive' : ''}`}
                onClick={this.playPrevious}
              >
                fast_rewind
              </i>
              {songState === 'paused' || songState === 'stopped' ? (
                <i title="Play" className="material-icons play-btn" onClick={this.pauseSong}>
                  play_circle_outline
                </i>
              ) : (
                <i title="Pause" className="material-icons play-btn" onClick={this.pauseSong}>
                  pause_circle_outline
                </i>
              )}
              <i title="Next" className={`material-icons ${songs.length <= 1 ? 'inactive' : ''}`} onClick={this.playNext}>
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
              ) : localVolume === 0 ? (
                <i title="Volume" onClick={this.handleMuteVolume} className="material-icons">
                  volume_off
                </i>
              ) : localVolume <= 40 ? (
                <i title="Volume" onClick={this.handleMuteVolume} className="material-icons">
                  volume_down
                </i>
              ) : (
                <i title="Volume" onClick={this.handleMuteVolume} className="material-icons">
                  volume_up
                </i>
              )}

              <div className="volume-progressbar">
                <div className="progress-fill" style={{ width: `${localVolume}%` }} />
                <input
                  onChange={this.handleVolumeChange}
                  title="Volume"
                  type="range"
                  value={localVolume}
                  min="0"
                  max="100"
                />
              </div>
              {songsRepeat === 'none' ? (
                <i title="Repeat disabled" className="material-icons" onClick={() => this.props.setSongRepeat('all')}>
                  sync_disabled
                </i>
              ) : songsRepeat === 'all' ? (
                <i title="Repeat all" className="material-icons" onClick={() => this.props.setSongRepeat('single')}>
                  sync
                </i>
              ) : (
                <div style={{ position: 'relative', top: 2 }}>
                  <i title="Repeat single" className="material-icons" onClick={() => this.props.setSongRepeat('none')}>
                    sync
                  </i>
                  <span className="superscript">1</span>
                </div>
              )}
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
