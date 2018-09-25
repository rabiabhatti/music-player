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
    const { currentTime, currentSeekTime, duration } = this.state

    const currentTimeToUse = currentSeekTime !== null && this.dragging ? currentSeekTime : currentTime
    const percentage = duration === 0 ? 0 : (currentTimeToUse / duration) * 100

    return (
      <React.Fragment>
        <span className="btn-white">{humanizeDuration(currentTime)}</span>
        <div>
          <div className="progress-fill" style={{ width: `${percentage + 0.5}%` }} />
          <input type="range" onChange={this.handleDurationSlide} value={currentTimeToUse} min={0} max={duration} />
        </div>
        <span className="btn-white">{humanizeDuration(duration)}</span>
      </React.Fragment>
    )
  }
}

export default PlayerControlDuration
