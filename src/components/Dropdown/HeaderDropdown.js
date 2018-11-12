// @flow

import React from 'react'

import getEventPath from '~/common/getEventPath'

import flex from '~/less/flex.less'
import button from '~/less/button.less'
import dropdown from '~/less/dropdown.less'

type Props = {|
  className: string,
  buttonIcon: string,
  buttonTitle: string,
  children: React$Node,
  handleClose?: boolean,
|}
type State = {|
  opened: boolean,
|}

export default class HeaderDropdown extends React.Component<Props, State> {
  static defaultProps = {
    handleClose: false,
  }

  state = { opened: false }
  ref: ?HTMLDivElement = null

  componentDidMount() {
    document.addEventListener('click', this.handleBodyClick)
    document.addEventListener('keydown', this.handleKeyPress)
  }

  componentDidUpdate(prevProps: Props) {
    const { handleClose } = this.props
    if (prevProps.handleClose !== handleClose) {
      this.close()
    }
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleBodyClick)
    document.removeEventListener('keydown', this.handleKeyPress)
  }

  handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      this.close()
    }
  }
  handleBodyClick = (e: MouseEvent) => {
    if (e.defaultPrevented) {
      return
    }
    const firedOnSelf = getEventPath(e).includes(this.ref)
    if (!firedOnSelf) {
      this.close()
    }
  }

  close = () => {
    this.setState({
      opened: false,
    })
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
        <button
          type="button"
          className={`${button.btn} ${button.btn_header}`}
          onClick={() => this.setState({ opened: true })}
        >
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
