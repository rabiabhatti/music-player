// @flow

import React from 'react'

import '~/less/dropdown.less'
import getEventPath from '~/common/getEventPath'

type Props = {|
  children: React$Node,
  handleClose: () => void,
|}

type State = {|
  opened: boolean,
|}

export default class Dropdown extends React.Component<Props, State> {
  state = { opened: false }
  ref: ?HTMLDivElement = null

  componentDidMount() {
    document.addEventListener('click', this.handleBodyClick)
    document.addEventListener('keydown', this.handleKeyPress)
  }
  componentWillUnmount() {
    document.removeEventListener('click', this.handleBodyClick)
    document.removeEventListener('keydown', this.handleKeyPress)
  }

  handleKeyPress = (e: KeyboardEvent) => {
    const { handleClose } = this.props
    if (e.key === 'Escape') {
      handleClose()
    }
  }
  handleBodyClick = (e: MouseEvent) => {
    if (e.defaultPrevented) {
      return
    }

    const { opened } = this.state
    const firedOnSelf = getEventPath(e).includes(this.ref)
    if (opened || firedOnSelf) {
      this.setState({
        opened: !opened,
      })
    }
  }

  render() {
    const { opened } = this.state
    const { children } = this.props

    return (
      <div
        className="section-dropdown align-center"
        ref={element => {
          this.ref = element
        }}
      >
        <i className="material-icons btn-blue">more_horiz</i>
        <div className={`dropdown_content ${opened ? '' : 'hidden'}`}>{children}</div>
      </div>
    )
  }
}
