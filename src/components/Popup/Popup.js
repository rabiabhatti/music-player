// @flow

import React from 'react'
import ReactDOM from 'react-dom'

import getEventPath from '~/common/getEventPath'

import flex from '~/less/flex.less'
import popup from '~/less/popup.less'
import button from '~/less/button.less'

type Props = {|
  title: string,
  children: React$Node,
  handleClose: () => void,
|}

export default class Popup extends React.Component<Props> {
  ref: ?HTMLDivElement = null
  element = document.createElement('div')

  componentDidMount() {
    const modalRootRef = document.getElementById('modal-popup-root')
    if (modalRootRef) {
      modalRootRef.appendChild(this.element)
    }
    document.addEventListener('click', this.handleBodyClick)
    document.addEventListener('keydown', this.handleKeyPress)
  }
  componentWillUnmount() {
    this.element.remove()
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
    const { handleClose } = this.props
    const firedOnSelf = getEventPath(e).includes(this.ref)
    if (!firedOnSelf) {
      handleClose()
    }
  }

  render() {
    const { children, handleClose, title } = this.props

    return ReactDOM.createPortal(
      <div className={`${popup.popup}`}>
        <div
          ref={element => {
            this.ref = element
          }}
          className={`${flex.wrap} ${flex.space_between} ${popup.popup_content}`}
        >
          <button type="button" className={`${button.btn} ${button.btn_round} ${popup.close}`} onClick={handleClose}>
            <i title="Close" className="material-icons">
              close
            </i>
          </button>
          <h3 className={`${popup.title}`}>{title}</h3>
          {children}
        </div>
      </div>,
      this.element,
    )
  }
}
