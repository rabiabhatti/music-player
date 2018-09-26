// @flow

import React from 'react'
import debounce from 'lodash/debounce'
import { humanizeDuration } from '~/common/songs'

import flex from '~/styles/flex.less'
import slider from '~/styles/slider.less'
import player from '~/styles/player.less'

type Props = {|
  title: string,
  artist: string,
  audioElement: HTMLAudioElement,
|}
type State = {|
  currentSeekTime: number | null,
  currentTime: number,
  duration: number,
|}

class PlayerControlDuration extends React.Component<Props, State> {
  state = { currentSeekTime: null, currentTime: 0, duration: 0 }
  dragging = false

  handleDurationSlideFlush = debounce(() => {
    const { audioElement } = this.props
    const { currentSeekTime } = this.state
    if (currentSeekTime !== null) {
      audioElement.currentTime = currentSeekTime
    }
    this.dragging = false
  }, 50)

  componentDidMount() {
    const { audioElement } = this.props
    audioElement.addEventListener('timeupdate', this.handleDurationChange)
  }
  componentWillUnmount() {
    const { audioElement } = this.props
    audioElement.removeEventListener('timeupdate', this.handleDurationChange)
  }

  handleDurationChange = () => {
    const { audioElement } = this.props
    this.setState({
      currentTime: audioElement.currentTime || 0,
      duration: audioElement.duration || 0,
    })
  }

  handleDurationSlide = (e: SyntheticInputEvent<HTMLInputElement>) => {
    this.setState({ currentSeekTime: parseInt(e.target.value, 10) })
    this.dragging = true
    this.handleDurationSlideFlush()
  }

  render() {
    const { title, artist } = this.props
    const { currentTime, currentSeekTime, duration } = this.state

    const currentTimeToUse = currentSeekTime !== null && this.dragging ? currentSeekTime : currentTime
    const percentage = duration === 0 ? 0 : (currentTimeToUse / duration) * 100

    return (
      <div className={player.progress_bar_info}>
        <div className={player.progress_bar}>
          <input
            min={0}
            type="range"
            max={duration}
            className={slider.range}
            value={currentTimeToUse}
            onChange={this.handleDurationSlide}
          />
          <div className={player.progress_fill} style={{ width: `${percentage + 0.5}%` }} />
        </div>
        <div className={`${flex.row} ${flex.align_center} ${flex.space_between}`}>
          <h1 className={flex.baseline}>
            {title}
            <span className={player.lighten}> &bull; {artist}</span>
          </h1>
          <p>
            <span>{humanizeDuration(currentTime)}</span> /{' '}
            <span className={player.lighten}>{humanizeDuration(duration)}</span>
          </p>
        </div>
      </div>
    )
  }
}

export default PlayerControlDuration
