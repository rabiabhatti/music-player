// @flow

import React from 'react'
import ReactDOM from 'react-dom'

import snackbar from '~/styles/snackbar.less'

type Props = {|
  type: string,
  children: React$Node,
  handleClose?: ?() => void,
|}

export default class Snackbar extends React.Component<Props> {
  static defaultProps = {
    handleClose: null,
  }

  ref: ?HTMLDivElement = null
  element = document.createElement('div')

  componentDidMount() {
    const modalRootRef = document.getElementById('modal-snackbar-root')
    if (modalRootRef) modalRootRef.appendChild(this.element)
  }

  componentDidUpdate() {
    const { type } = this.props
    if (type === 'downloaded') this.close()
  }

  componentWillUnmount() {
    clearTimeout(this.timeoutID)
    this.element.remove()
  }

  close = () => {
    this.timeoutID = setTimeout(() => {
      const { handleClose } = this.props
      if (handleClose) handleClose()
    }, 10000)
  }
  timeoutID: TimeoutID

  render() {
    const { children } = this.props

    return ReactDOM.createPortal(
      <div className={`${snackbar.snackbar}`}>
        <div>{children}</div>
      </div>,
      this.element,
    )
  }
}
