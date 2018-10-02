// @flow

import React from 'react'
import debounce from 'lodash/debounce'
import connect from '~/common/connect'

import { setSongMute, setSongVolume } from '~/redux/songs'

import flex from '~/less/flex.less'
import button from '~/less/button.less'
import slider from '~/less/slider.less'
import player from '~/less/player.less'

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
  dragging = false

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

  componentDidMount() {
    const { audioElement, songMuted, songVolume } = this.props
    audioElement.volume = songMuted ? 0 : songVolume / 100
    audioElement.addEventListener('volumechange', this.handleVolumeChange)
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
    const { audioElement } = this.props
    audioElement.removeEventListener('volumechange', this.handleVolumeChange)
  }
  getVolumeToUse() {
    const { songVolume } = this.props
    const { currentSeekVolume } = this.state

    return currentSeekVolume !== null && this.dragging ? currentSeekVolume : songVolume
  }

  handleVolumeChange = () => {
    const { audioElement, songMuted, dispatch } = this.props
    const newValue = audioElement.volume
    if (newValue === 0 && songMuted) {
      // Don't let mutes destroy local volume state
      return
    }
    dispatch(setSongVolume(newValue * 100))
  }
  handleVolumeSlide = (e: SyntheticInputEvent<HTMLInputElement>) => {
    this.setState({ currentSeekVolume: parseInt(e.target.value, 10) })

    this.dragging = true
    this.handleVolumeSlideFlush()
  }

  handleMuteUnmute = (mute: boolean) => {
    const { dispatch, songMuted } = this.props

    if (songMuted || mute) {
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
      <div className={`${player.volume} ${flex.align_center} ${flex.row}`}>
        <button
          type="button"
          className={`${button.btn} ${button.btn_round}`}
          onClick={() => {
            this.handleMuteUnmute(icon !== 'volume_off')
          }}
        >
          <i title="Volume" className="material-icons">
            {icon}
          </i>
        </button>
        <div className={player.volume_slider}>
          <input
            min="0"
            max="100"
            type="range"
            title="Volume"
            className={slider.range}
            value={currentVolumeToUse}
            onChange={this.handleVolumeSlide}
          />
          <div className={player.progress_fill} style={{ width: `${currentVolumeToUse}%` }} />
        </div>
      </div>
    )
  }
}

export default connect(({ songs }) => ({
  songMuted: songs.songMuted,
  songVolume: songs.songVolume,
}))(PlayerControlsVolume)
