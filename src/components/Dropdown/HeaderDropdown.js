// @flow

import React from 'react'

import getEventPath from '~/common/getEventPath'

import flex from '~/styles/flex.less'
import button from '~/styles/button.less'
import dropdown from '~/styles/dropdown.less'

type Props = {|
  className: string,
  buttonIcon: string,
  buttonTitle: string,
  children: React$Node,
|}
type State = {|
  opened: boolean,
|}

export default class HeaderDropdown extends React.Component<Props, State> {
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
    if (e.key === 'Escape') this.setState({ opened: false })
  }
  handleBodyClick = (e: MouseEvent) => {
    const { opened } = this.state
    const firedOnSelf = getEventPath(e).includes(this.ref)
    if (opened || firedOnSelf) this.setState({ opened: !opened })
  }

  render() {
    const { opened } = this.state
    const { children, className, buttonIcon, buttonTitle } = this.props

    return (
      <div
        ref={element => {
          this.ref = element
        }}
      >
        <button type="button" className={`${button.btn} ${button.btn_header}`}>
          <i title={buttonTitle} className="material-icons">
            {buttonIcon}
          </i>
          {buttonTitle}
        </button>
        <div
          className={`${dropdown.dropdown_content} ${className} ${flex.justify_start} ${flex.column} ${
            opened ? '' : 'hidden'
          }`}
        >
          {children}
        </div>
      </div>
    )
  }
}
