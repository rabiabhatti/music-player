// @flow

import React from 'react'
import ReactDOM from 'react-dom'

import connect from '~/common/connect'
import getEventPath from '~/common/getEventPath'
import { deleteSongsFromLibrary } from '~/common/songs'
import { incrementNonce, playLater, setSongPlaylist } from '~/redux/songs'

import AddToPlaylist from './Dropdown/AddToPlaylist'

import flex from '~/styles/flex.less'
import button from '~/styles/button.less'
import dropdown from '~/styles/dropdown.less'

type Props = {|
  top: string,
  left: string,
  songsIds: Array<number>,
  handleClose: () => void,
  incrementNonce: () => void,
  playLater: typeof playLater,
  setSongPlaylist: typeof setSongPlaylist,
|}
type State = {||}

class ContextMenu extends React.Component<Props, State> {
  ref: ?HTMLDivElement = null
  element = document.createElement('div')

  componentDidMount() {
    const modalRootRef = document.getElementById('modal-contextmenu-root')
    if (modalRootRef) modalRootRef.appendChild(this.element)

    document.addEventListener('click', this.handleBodyClick)
    document.addEventListener('contextmenu', this.handleRightClick)
    document.addEventListener('keydown', this.handleKeyPress)
  }

  componentWillUnmount() {
    this.element.remove()
    document.removeEventListener('click', this.handleBodyClick)
    document.removeEventListener('contextmenu', this.handleRightClick)
    document.removeEventListener('keydown', this.handleKeyPress)
  }

  handleRightClick = () => {
    const { handleClose } = this.props
    handleClose()
  }

  playAtIndex = (index: number) => {
    const { setSongPlaylist: setSongPlaylistProp, songsIds } = this.props
    setSongPlaylistProp({
      songs: songsIds,
      index,
    })
  }

  deleteSongs = () => {
    const { incrementNonce: incrementNonceProp, songsIds: ids } = this.props
    deleteSongsFromLibrary(ids)
    incrementNonceProp()
  }

  handleKeyPress = (e: KeyboardEvent) => {
    const { handleClose } = this.props
    if (e.key === 'Escape') handleClose()
  }

  handleBodyClick = (e: MouseEvent) => {
    const { handleClose } = this.props
    const firedOnSelf = getEventPath(e).includes(this.ref)
    if (!firedOnSelf) {
      handleClose()
    }
  }

  render() {
    const { songsIds, playLater: playLaterProp, top, left } = this.props

    return ReactDOM.createPortal(
      <div style={{ position: 'relative', top: `${top}`, left: `${left}` }}>
        <div
          ref={element => {
            this.ref = element
          }}
          className={`${dropdown.dropdown_content}`}
        >
          <AddToPlaylist songsIds={songsIds} />
          <button className={`${button.btn} ${flex.justify_start}`} type="button" onClick={() => this.playAtIndex(0)}>
            <i className="material-icons">music_note</i>
            Play now
          </button>
          <button className={`${button.btn} ${flex.justify_start}`} type="button" onClick={() => playLaterProp(songsIds)}>
            <i className="material-icons">watch_later</i>
            Play Later
          </button>
          <button className={`${button.btn} ${flex.justify_start}`} type="button" onClick={this.deleteSongs}>
            <i className="material-icons">delete</i>
            Delete from Library
          </button>
        </div>
      </div>,
      this.element,
    )
  }
}

export default connect(
  null,
  { incrementNonce, playLater, setSongPlaylist },
)(ContextMenu)
