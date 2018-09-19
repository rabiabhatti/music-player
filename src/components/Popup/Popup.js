// @flow

import React from 'react'
import ReactDOM from 'react-dom'

import '~/styles/popup.less'
import getEventPath from '~/common/getEventPath'

type Props = {|
  children: React$Node,
  handleClose: () => void,
|}

export default class Popup extends React.Component<Props> {
  componentDidMount() {
    const modalRootRef = document.getElementById('modal-root')
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

  timeout: TimeoutID
  ref: ?HTMLDivElement = null
  element = document.createElement('div')

  handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      this.props.handleClose()
    }
  }

  handleBodyClick = (e: MouseEvent) => {
    if (e.defaultPrevented) {
      return
    }

    const firedOnSelf = getEventPath(e).includes(this.ref)
    if (!firedOnSelf) {
      this.props.handleClose()
    }
  }

  render() {
    const { children, handleClose } = this.props

    return ReactDOM.createPortal(
      <div className="section-popup">
        <div
          className="popup-content flex-wrap"
          ref={element => {
            this.ref = element
          }}
        >
          <button className="close" onClick={handleClose}>
            ×
          </button>
          {children}
        </div>
      </div>,
      this.element,
    )
  }
}
