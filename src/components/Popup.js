// @flow

import React from 'react'

const DEFAULT_DURATION = 5000 * 60

type Props = {|
  children: React$Node,
  hash: string,
  duration: number,
|}
type State = {|
  hidden: boolean,
|}
export default class Popup extends React.Component<Props, State> {
  static defaultProps = {
    duration: DEFAULT_DURATION,
  }
  state = { hidden: false }

  componentDidMount() {
    this.start()
  }
  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.hash !== this.props.hash) {
      this.stop()
      this.start()
    }
  }
  componentWillUnmount() {
    this.stop()
  }

  timeout: TimeoutID
  start = () => {
    this.timeout = setTimeout(() => {
      this.setState({ hidden: true })
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
  }

  render() {
    if (this.state.hidden) {
      return null
    }

    return (
      <div className="section-popup">
        <div className="popup-content flex-wrap">
          <button className="close" onClick={this.close}>
            ×
          </button>
          {this.props.children}
        </div>
      </div>
    )
  }
}
