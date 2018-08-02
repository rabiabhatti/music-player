// @flow

import React from 'react'
import debounce from 'lodash/debounce'
import { connect } from 'react-redux'

import services from '~/services'
import { humanizeDuration } from '~/common/songs'
import type { SongToPlayState } from '~/redux/songs'
import type { UserAuthorization } from '~/redux/user'

import Popup from './Popup'
import Dropdown from './Dropdown'
import SubDropdown from './SubDropdown'

import cover from '../static/img/album-cover.jpg'

const DEFAULT_VOLUME = 50

type Props = {|
  songToPlay: SongToPlayState,
  authorizations: Array<UserAuthorization>,
|}
type State = {|
  pause: boolean,
  volume: number,
  duration: number,
  currentTime: number,
  progressbarWidth: number,
  showPlaylistPopup: number | null,
|}

class Player extends React.Component<Props, State> {
  source = null
  volume = null
  audioContext = new AudioContext()
  setInterval: IntervalID

  state = {
    pause: false,
    duration: 0,
    currentTime: 0,
    progressbarWidth: 0,
    volume: DEFAULT_VOLUME,
    showPlaylistPopup: null,
  }

  componentDidMount() {
    if (this.props.songToPlay) {
      this.getData(this.props.songToPlay)
      this.setInterval = setInterval(() => {
        this.updateCurrentTime()
      }, 1000)
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.songToPlay && this.props.songToPlay && nextProps.songToPlay.sourceId !== this.props.songToPlay.sourceId) {
      if (this.source) {
        this.source.stop(0)
      }
      this.clearCurrentTime()
      this.audioContext.close()
      this.getData(nextProps.songToPlay)
      this.setInterval = setInterval(() => {
        this.updateCurrentTime()
      }, 1000)
    }
  }
  componentWillUnmount() {
    this.clearCurrentTime()
  }
  updateCurrentTime = () => {
    if (this.state.pause) {
      this.setState(prevState => ({
        currentTime: prevState.currentTime,
      }))
      return
    } else if (this.state.currentTime >= this.state.duration) {
      this.setState({ currentTime: -1 })
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
    const volume = event.target
    if (this.volume) {
      this.volume.gain.value = parseInt(volume.value, 10) / 100
      this.setState({ volume: parseInt(volume.value, 10) })
    }
  }

  applyProgressbarChange = debounce((value: number) => {
    if (this.source) {
      this.getData(this.props.songToPlay, value)
    }
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

  getData = (song: Object, time: ?number) => {
    const { authorizations } = this.props
    if (!authorizations.length) {
      console.warn('No authorizations found')
      return
    }

    this.source = this.audioContext.createBufferSource()
    this.volume = this.audioContext.createGain()
    this.volume.gain.value = this.state.volume / 100
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
        this.source.loop = true
        this.source.buffer = decodedData
        if (time) {
          this.source.start(this.audioContext.currentTime, time, this.state.duration)
        } else {
          this.source.start(0)
        }
        this.setState({ pause: false, duration: decodedData.duration })
      }
    })
  }

  pauseSong = () => {
    if (this.audioContext.state === 'running') {
      this.audioContext.suspend()
      this.setState({ pause: true })
    } else if (this.audioContext.state === 'suspended') {
      this.audioContext.resume()
      this.setState({ pause: false })
    }
  }

  render() {
    const song = this.props.songToPlay
    const { volume, showPlaylistPopup, pause, duration, currentTime, progressbarWidth } = this.state

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
              <h1 className="song-title">{song.name ? song.name : 'Empty'}</h1>
              <h4 className="song-artist">{song.artists ? song.artists : 'Empty'}</h4>
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
              <i title="Previous" className="material-icons">
                fast_rewind
              </i>
              {pause ? (
                <i title="Play" className="material-icons play-btn" onClick={this.pauseSong}>
                  play_circle_outline
                </i>
              ) : (
                <i title="Pause" className="material-icons play-btn" onClick={this.pauseSong}>
                  pause_circle_outline
                </i>
              )}
              <i title="Next" className="material-icons">
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
              {volume === 0 ? (
                <i title="Volume" className="material-icons">
                  volume_off
                </i>
              ) : volume <= 40 ? (
                <i title="Volume" className="material-icons">
                  volume_down
                </i>
              ) : (
                <i title="Volume" className="material-icons">
                  volume_up
                </i>
              )}
              <div className="volume-progressbar">
                <div className="progress-fill" style={{ width: `${volume}%` }} />
                <input onChange={this.handleVolumeChange} title="Volume" type="range" value={volume} min="0" max="100" />
              </div>
              <i title="Shuffle" className="material-icons">
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
  state => ({ authorizations: state.user.authorizations.toArray(), songToPlay: state.songs.songToPlay }),
  null,
)(Player)
