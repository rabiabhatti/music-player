// @flow

import React from 'react'
import connect from '~/common/connect'

import '~/css/popup.css'

import db from '~/db'
import getEventPath from '~/common/getEventPath'
import { showPopup } from '~/redux/popup'

const DEFAULT_DURATION = 5000 * 60

type Props = {|
  hash: string,
  showPopup: showPopup,
  songsIds: ?Array<number>,
  duration: number,
|}
type State = {|
  hidden: boolean,
  value: string,
|}
class Popup extends React.Component<Props, State> {
  ref: ?HTMLDivElement = null
  timeout: TimeoutID

  static defaultProps = {
    duration: DEFAULT_DURATION,
  }
  state = { hidden: false, value: '' }

  componentDidMount() {
    this.start()
    document.addEventListener('click', this.handleBodyClick)
    document.addEventListener('keydown', this.handleEscapeKeyPress)
  }
  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.hash !== this.props.hash) {
      this.stop()
      this.start()
    }
  }
  componentWillUnmount() {
    this.stop()
    document.removeEventListener('click', this.handleBodyClick)
    document.removeEventListener('keydown', this.handleEscapeKeyPress)
  }

  handleEscapeKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && !this.state.hidden) {
      this.close()
    }
  }

  handleBodyClick = (e: MouseEvent) => {
    if (e.defaultPrevented) {
      return
    }

    const hidden = this.state.hidden
    const firedOnSelf = getEventPath(e).includes(this.ref)
    if (!hidden && !firedOnSelf) {
      this.setState({
        hidden: !hidden,
      })
      this.props.showPopup({ show: false, songsIds: [] })
    }
  }

  start = () => {
    this.timeout = setTimeout(() => {
      this.setState({ hidden: true })
      this.props.showPopup({ show: false, songsIds: [] })
    }, this.props.duration)
  }
  stop = () => {
    clearTimeout(this.timeout)
    if (this.state.hidden) {
      this.setState({ hidden: false })
    }
  }
  close = () => {
    clearTimeout(this.timeout)
    this.setState({ hidden: true })
    this.props.showPopup({ show: false, songsIds: [] })
  }

  handleChange = (event: SyntheticInputEvent<HTMLInputElement>) => {
    this.setState({ value: event.target.value })
  }

  savePlaylist = () => {
    db.playlists.add({ name: this.state.value, songs: this.props.songsIds })
    this.close()
  }

  render() {
    const { value, hidden } = this.state
    const enable = this.state.value !== '' && this.state.value.replace(/\s/g, '') !== ''
    if (hidden) {
      return null
    }

    return (
      <div className="section-popup">
        <div
          className="popup-content flex-wrap"
          ref={element => {
            this.ref = element
          }}
        >
          <button className="close" onClick={this.close}>
            ×
          </button>
          <input type="text" placeholder="Choose name" value={value} name="name" onInput={this.handleChange} />
          <button className="btn-blue" onClick={this.savePlaylist} disabled={!enable}>
            Save
          </button>
        </div>
      </div>
    )
  }
}

export default connect(
  null,
  { showPopup },
)(Popup)
