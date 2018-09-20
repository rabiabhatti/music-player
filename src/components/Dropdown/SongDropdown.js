// @flow

import * as React from 'react'
import connect from '~/common/connect'

import { incrementNonce, playNext, playLater } from '~/redux/songs'
import { deleteSongsFromLibrary, deleteSongFromPlaylist } from '~/common/songs'

import EditSong from '~/components/Popup/EditSong'

import Dropdown from './Dropdown'
import AddToPlaylist from './AddToPlaylist'

type Props = {|
  song: Object,
  playlist: ?Object,
  activeSong: number,
  playNext: typeof playNext,
  handleClose: () => void,
  incrementNonce: () => void,
  playLater: typeof playLater,
|}
type State = {|
  showEditSongModal: boolean,
|}

class SongDropdown extends React.Component<Props, State> {
  state = {
    showEditSongModal: false,
  }

  deleteSong = (e: SyntheticEvent<HTMLButtonElement>, id: number, playlist?: Object) => {
    e.preventDefault()
    const { activeSong } = this.props
    if (id === activeSong) {
      this.props.playNext()
    }
    if (playlist) {
      deleteSongFromPlaylist(playlist, id)
    } else {
      deleteSongsFromLibrary([id])
    }
    this.props.incrementNonce()
  }

  render() {
    const { showEditSongModal } = this.state
    const { handleClose, playlist, song } = this.props

    return (
      <Dropdown handleClose={handleClose}>
        {showEditSongModal && <EditSong handleClose={() => this.setState({ showEditSongModal: false })} song={song} />}
        <AddToPlaylist songsIds={[song.id]} />
        <button type="button" onClick={() => this.setState({ showEditSongModal: true })}>
          Edit
        </button>
        <button type="button" onClick={() => this.props.playLater([song.id])}>
          Play Later
        </button>
        {playlist !== null && (
          <button type="button" onClick={e => this.deleteSong(e, song.id, playlist)}>
            Remove from Playlist
          </button>
        )}
        <button type="button" onClick={e => this.deleteSong(e, song.id)}>
          Delete from Library
        </button>
      </Dropdown>
    )
  }
}

export default connect(
  ({ songs }) => ({
    activeSong: songs.playlist[songs.songIndex],
    nonce: songs.nonce,
  }),
  { incrementNonce, playNext, playLater },
)(SongDropdown)
