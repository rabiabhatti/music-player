// @flow
/* eslint-disable jsx-a11y/no-static-element-interactions */

import React from 'react'

import '~/css/dropdown.css'

import getEventPath from '~/common/getEventPath'

type Props = {|
  children: React$Node,
|}
type State = {|
  opened: boolean,
|}

export default class Dropdown extends React.Component<Props, State> {
  state = { opened: false }

  componentDidMount() {
    document.addEventListener('click', this.handleBodyClick)
    document.addEventListener('keydown', this.handleBodyKeypress)
  }
  componentWillUnmount() {
    document.removeEventListener('click', this.handleBodyClick)
    document.removeEventListener('keydown', this.handleBodyKeypress)
  }
  ref: ?HTMLDivElement = null
  handleBodyClick = (e: MouseEvent) => {
    if (e.defaultPrevented) {
      return
    }

    const opened = this.state.opened
    const firedOnSelf = getEventPath(e).includes(this.ref)
    if (opened || firedOnSelf) {
      this.setState({
        opened: !opened,
      })
    }
  }
  handleBodyKeypress = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && this.state.opened) {
      this.setState({ opened: false })
    }
  }
  render() {
    return (
      <div
        className="section-dropdown"
        ref={element => {
          this.ref = element
        }}
      >
        <i className="material-icons song-dropdown">more_horiz</i>
        <div className={`dropdown-content ${this.state.opened ? '' : 'hidden'}`}>{this.props.children}</div>
      </div>
    )
  }
}
