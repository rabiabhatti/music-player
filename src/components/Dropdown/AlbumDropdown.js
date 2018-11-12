// @flow

import * as React from 'react'
import connect from '~/common/connect'

import { deleteSongsFromLibrary } from '~/common/songs'
import { incrementNonce, playLater, setSongPlaylist } from '~/redux/songs'

import EditAlbum from '~/components/Popup/EditAlbum'

import flex from '~/less/flex.less'
import button from '~/less/button.less'

import Dropdown from './Dropdown'
import AddToPlaylist from './AddToPlaylist'

type Props = {|
  songsIds: Array<number>,
  incrementNonce: () => void,
  playLater: typeof playLater,
  setSongPlaylist: typeof setSongPlaylist,
|}
type State = {|
  showEditAlbumModal: boolean,
|}

class AlbumDropdown extends React.Component<Props, State> {
  state = {
    showEditAlbumModal: false,
  }

  playAtIndex = (index: number) => {
    const { setSongPlaylist: setSongPlaylistProp, songsIds } = this.props
    setSongPlaylistProp({
      songs: songsIds,
      index,
    })
  }

  deleteSong = (e: SyntheticEvent<HTMLButtonElement>, ids: Array<number>) => {
    const { incrementNonce: incrementNonceProp } = this.props
    deleteSongsFromLibrary(ids)
    incrementNonceProp()
  }

  render() {
    const { showEditAlbumModal } = this.state
    const { songsIds, playLater: playLaterProp } = this.props

    return (
      <Dropdown>
        {showEditAlbumModal && (
          <EditAlbum handleClose={() => this.setState({ showEditAlbumModal: false })} songs={songsIds} />
        )}
        <AddToPlaylist songsIds={songsIds} />
        <button className={`${button.btn} ${flex.justify_start}`} type="button" onClick={() => this.playAtIndex(0)}>
          <i className="material-icons">music_note</i>
          Play Now
        </button>
        <button className={`${button.btn} ${flex.justify_start}`} type="button" onClick={() => playLaterProp(songsIds)}>
          <i className="material-icons">watch_later</i>
          Play Later
        </button>
        <button
          className={`${button.btn} ${flex.justify_start}`}
          type="button"
          onClick={() => this.setState({ showEditAlbumModal: true })}
        >
          <i className="material-icons">edit</i>
          Edit Album
        </button>
        <button className={`${button.btn} ${flex.justify_start}`} type="button" onClick={e => this.deleteSong(e, songsIds)}>
          <i className="material-icons">delete</i>
          Delete from Library
        </button>
      </Dropdown>
    )
  }
}

export default connect(
  null,
  { incrementNonce, playLater, setSongPlaylist },
)(AlbumDropdown)
