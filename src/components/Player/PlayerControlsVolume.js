// @flow

import React from 'react'
import debounce from 'lodash/debounce'
import connect from '~/common/connect'

import { setSongMute, setSongVolume } from '~/redux/songs'

type State = {|
  currentSeekVolume: number | null,
|}
type Props = {|
  dispatch: Function,
  songMuted: boolean,
  songVolume: number,
  audioElement: HTMLAudioElement,
|}

class PlayerControlsVolume extends React.Component<Props, State> {
  state = { currentSeekVolume: null }

  componentDidMount() {
    this.props.audioElement.volume = this.props.songMuted ? 0 : this.props.songVolume
    this.props.audioElement.addEventListener('volumechange', this.handleVolumeChange)
  }
  componentWillReceiveProps(newProps) {
    const { songMuted: oldMuted, songVolume: oldVolume, audioElement } = this.props
    if (oldMuted !== newProps.songMuted) {
      if (newProps.songMuted) {
        audioElement.volume = 0
      } else {
        audioElement.volume = newProps.songVolume / 100
      }
    }
    if (!newProps.songMuted && newProps.songVolume !== oldVolume) {
      audioElement.volume = newProps.songVolume / 100
    }
  }
  componentWillUnmount() {
    this.props.audioElement.removeEventListener('volumechange', this.handleVolumeChange)
  }
  getVolumeToUse() {
    const { songVolume } = this.props
    const { currentSeekVolume } = this.state

    return currentSeekVolume !== null && this.dragging ? currentSeekVolume : songVolume
  }

  dragging = false
  handleVolumeChange = () => {
    const newValue = this.props.audioElement.volume
    if (newValue === 0 && this.props.songMuted) {
      // Don't let mutes destroy local volume state
      return
    }
    this.props.dispatch(setSongVolume(newValue * 100))
  }
  handleVolumeSlide = (e: SyntheticInputEvent<HTMLInputElement>) => {
    this.setState({ currentSeekVolume: parseInt(e.target.value, 10) })

    this.dragging = true
    this.handleVolumeSlideFlush()
  }
  handleVolumeSlideFlush = debounce(() => {
    const { dispatch, audioElement, songMuted } = this.props
    const { currentSeekVolume } = this.state
    if (currentSeekVolume !== null) {
      audioElement.volume = currentSeekVolume / 100
      if (audioElement.volume < 0.01) {
        dispatch(setSongMute(false))
      } else if (songMuted) {
        dispatch(setSongMute(false))
      }
    }
    this.dragging = false
  }, 10)
  handleMuteUnmute = (mute: boolean) => {
    const { dispatch } = this.props

    if (this.props.songMuted) {
      dispatch(setSongMute(mute))
    } else {
      dispatch(setSongVolume(50))
    }
  }

  render() {
    const { songMuted } = this.props

    const currentVolumeToUse = this.getVolumeToUse()

    let icon = 'volume_up'
    if (currentVolumeToUse === 0 || songMuted) {
      icon = 'volume_off'
    } else if (currentVolumeToUse < 40) {
      icon = 'volume_down'
    }

    return (
      <React.Fragment>
        <button
          onClick={() => {
            this.handleMuteUnmute(icon !== 'volume_off')
          }}
        >
          <i title="Volume" className="material-icons">
            {icon}
          </i>
        </button>

        <div className="volume-progressbar">
          <div className="progress-fill" style={{ width: `${currentVolumeToUse}%` }} />
          <input
            onChange={this.handleVolumeSlide}
            title="Volume"
            type="range"
            value={currentVolumeToUse}
            min="0"
            max="100"
          />
        </div>
      </React.Fragment>
    )
  }
}

export default connect(({ songs }) => ({
  songMuted: songs.songMuted,
  songVolume: songs.songVolume,
}))(PlayerControlsVolume)
