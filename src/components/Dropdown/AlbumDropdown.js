// @flow

import * as React from 'react'
import connect from '~/common/connect'

import { incrementNonce, playLater } from '~/redux/songs'
import { deleteSongsFromLibrary } from '~/common/songs'

import EditAlbum from '~/components/Popup/EditAlbum'

import Dropdown from './Dropdown'
import AddToPlaylist from './AddToPlaylist'

type Props = {|
  songsIds: Array<number>,
  handleClose: () => void,
  incrementNonce: () => void,
  playLater: typeof playLater,
|}
type State = {|
  showEditAlbumModal: boolean,
|}

class AlbumDropdown extends React.Component<Props, State> {
  state = {
    showEditAlbumModal: false,
  }

  deleteSong = (e: SyntheticEvent<HTMLButtonElement>, ids: Array<number>) => {
    deleteSongsFromLibrary(ids)
    this.props.incrementNonce()
  }

  render() {
    const { showEditAlbumModal } = this.state
    const { handleClose, songsIds } = this.props

    return (
      <Dropdown handleClose={handleClose}>
        {showEditAlbumModal && (
          <EditAlbum handleClose={() => this.setState({ showEditAlbumModal: false })} songs={songsIds} />
        )}
        <AddToPlaylist songsIds={songsIds} />
        <button type="button" onClick={() => this.setState({ showEditAlbumModal: true })}>
          Edit Album
        </button>
        <button type="button" onClick={() => this.props.playLater(songsIds)}>
          Play Later
        </button>
        <button type="button" onClick={e => this.deleteSong(e, songsIds)}>
          Delete from Library
        </button>
      </Dropdown>
    )
  }
}

export default connect(
  null,
  { incrementNonce, playLater },
)(AlbumDropdown)
