// @flow

import React from 'react'
import { connect } from 'react-redux'

import services from '~/services'
import { humanizeDuration } from '~/common/songs'
import type { SongToPlayState } from '~/redux/songs'
import type { UserAuthorization } from '~/redux/user'

import Popup from './Popup'
import Dropdown from './Dropdown'
import SubDropdown from './SubDropdown'

import cover from '../static/img/album-cover.jpg'

const DEFAULT_PROGRESS = 50
const DEFAULT_VOLUME = 50

type Props = {|
  songToPlay: SongToPlayState,
  authorizations: Array<UserAuthorization>,
|}
type State = {|
  stop: boolean,
  volume: number,
  progress: number,
  duration: number,
  showPlaylistPopup: number | null,
|}

class Player extends React.Component<Props, State> {
  source = null
  audioContext = new AudioContext()

  state = {
    stop: true,
    duration: 0,
    progress: DEFAULT_PROGRESS,
    volume: DEFAULT_VOLUME,
    showPlaylistPopup: null,
  }

  componentDidMount() {
    if (this.props.songToPlay) {
      this.getData(this.props.songToPlay)
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.songToPlay && this.props.songToPlay && nextProps.songToPlay.sourceId !== this.props.songToPlay.sourceId) {
      if (this.source) {
        this.source.stop(0)
      }
      this.getData(nextProps.songToPlay)
    }
  }

  showPlaylistPopupInput = (e: SyntheticInputEvent<HTMLInputElement>) => {
    e.preventDefault()
    this.setState({ showPlaylistPopup: Date.now() })
  }

  onDrag = () => {
    const inlineStyle = document.createElement('style')
    const rangeSelector = document.querySelectorAll('[type=range]')
    const inlineStyleContent = []
    if (document.body) {
      document.body.appendChild(inlineStyle)
    }
    const eventname = new Event('input')
    for (const item of rangeSelector) {
      item.addEventListener(
        'input',
        function() {
          const rangeInterval = Number(this.getAttribute('max') - this.getAttribute('min'))
          const rangePercent = (Number(this.value) + Math.abs(this.getAttribute('min'))) / rangeInterval * 97
          writeStyle({
            id: this.id,
            percent: rangePercent,
          })
        },
        false,
      )
      item.dispatchEvent(eventname)
    }
    function writeStyle(obj) {
      const find = inlineStyleContent.map(x => x.id).indexOf(obj.id)
      let styleText = ''
      if (find === -1) {
        inlineStyleContent.push(obj)
      } else {
        inlineStyleContent[find] = obj
      }
      for (const item of inlineStyleContent) {
        styleText += `#${item.id}::-webkit-slider-runnable-track{background-size:${item.percent}% 100%} `
      }
      inlineStyle.textContent = styleText
    }
  }

  getData = (song: Object) => {
    const { authorizations } = this.props
    if (!authorizations.length) {
      console.warn('No authorizations found')
      return
    }

    this.source = this.audioContext.createBufferSource()
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
        this.source.connect(this.audioContext.destination)
        this.source.start(0)
        this.setState({ stop: false, duration: this.source.buffer.duration })
      }
    })
  }

  playSong = () => {
    if (this.source) {
      this.source.start(0)
      this.setState({ stop: false })
    }
  }
  stopSong = () => {
    if (this.source) {
      this.source.stop(0)
      this.setState({ stop: true })
    }
  }

  render() {
    const song = this.props.songToPlay
    const { progress, volume, showPlaylistPopup, stop, duration } = this.state

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
              {stop ? (
                <i title="Play" className="material-icons play-btn" onClick={this.playSong}>
                  play_circle_outline
                </i>
              ) : (
                <i title="Pause" className="material-icons play-btn" onClick={this.stopSong}>
                  pause_circle_outline
                </i>
              )}
              <i title="Next" className="material-icons">
                fast_forward
              </i>
            </div>
            <div className="section-progress align-center space-between">
              <span>2:08</span>
              <input id="range" onMouseMove={this.onDrag} className="section-progressbar" type="range" min="1" max="100" />
              <span>{humanizeDuration(duration)}</span>
            </div>
            <div className="section-volume align-center">
              {volume === 0 ? (
                <i title="Volume" className="material-icons">
                  volume_off
                </i>
              ) : volume === 30 ? (
                <i title="Volume" className="material-icons">
                  volume_down
                </i>
              ) : (
                <i title="Volume" className="material-icons">
                  volume_up
                </i>
              )}
              <input
                id="range"
                className="volume-bar"
                onMouseMove={this.onDrag}
                title="Volume"
                type="range"
                min="1"
                max="100"
              />
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
