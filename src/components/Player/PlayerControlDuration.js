// @flow

import React from 'react'
import debounce from 'lodash/debounce'
import { humanizeDuration } from '~/common/songs'

type Props = {|
  audioElement: HTMLAudioElement,
|}
type State = {|
  currentSeekTime: number | null,
  currentTime: number,
  duration: number,
|}

class PlayerControlDuration extends React.Component<Props, State> {
  state = { currentSeekTime: null, currentTime: 0, duration: 0 }

  componentDidMount() {
    this.props.audioElement.addEventListener('timeupdate', this.handleDurationChange)
  }
  componentWillUnmount() {
    this.props.audioElement.removeEventListener('timeupdate', this.handleDurationChange)
  }

  dragging = false

  handleDurationChange = () => {
    this.setState({
      currentTime: this.props.audioElement.currentTime || 0,
      duration: this.props.audioElement.duration || 0,
    })
  }

  handleSliderChange = (e: SyntheticInputEvent<HTMLInputElement>) => {
    this.setState({ currentSeekTime: parseInt(e.target.value, 10) })

    this.dragging = true
    this.handleSliderValueFlush()
  }
  handleSliderValueFlush = debounce(() => {
    const { currentSeekTime } = this.state
    if (currentSeekTime !== null) {
      this.props.audioElement.currentTime = currentSeekTime
    }
    this.dragging = false
  }, 50)

  render() {
    const { currentTime, currentSeekTime, duration } = this.state

    const currentTimeToUse = currentSeekTime !== null && this.dragging ? currentSeekTime : currentTime
    const percentage = duration === 0 ? 0 : (currentTimeToUse / duration) * 100

    return (
      <React.Fragment>
        <span>{humanizeDuration(currentTime)}</span>
        <div className="progressbar">
          <div className="progress-fill" style={{ width: `${percentage + 0.5}%` }} />
          <input type="range" onChange={this.handleSliderChange} value={currentTimeToUse} min={0} max={duration} />
        </div>
        <span>{humanizeDuration(duration)}</span>
      </React.Fragment>
    )
  }
}

export default PlayerControlDuration
