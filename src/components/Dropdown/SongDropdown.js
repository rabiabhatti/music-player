// @flow

import * as React from 'react'
import connect from '~/common/connect'

import { incrementNonce, playNext, playLater } from '~/redux/songs'
import { deleteSongsFromLibrary, deleteSongFromPlaylist } from '~/common/songs'

import EditSong from '~/components/Popup/EditSong'

import flex from '~/less/flex.less'
import button from '~/less/button.less'

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
    const { activeSong, playNext: playNextProp, incrementNonce: incrementNonceProp } = this.props
    if (id === activeSong) {
      playNextProp()
    }
    if (playlist) {
      deleteSongFromPlaylist(playlist, id)
    } else {
      deleteSongsFromLibrary([id])
    }
    incrementNonceProp()
  }

  render() {
    const { showEditSongModal } = this.state
    const { handleClose, playlist, song, playLater: playLaterProp } = this.props

    return (
      <Dropdown handleClose={handleClose}>
        {showEditSongModal && <EditSong handleClose={() => this.setState({ showEditSongModal: false })} song={song} />}
        <AddToPlaylist songsIds={[song.id]} />
        <button className={`${button.btn} ${flex.justify_start}`} type="button" onClick={() => this.setState({ showEditSongModal: true })}>
          <i className="material-icons">edit</i>
          Edit
        </button>
        <button className={`${button.btn} ${flex.justify_start}`} type="button" onClick={() => playLaterProp([song.id])}>
          <i className="material-icons">watch_later</i>
          Play Later
        </button>
        {playlist !== null && (
          <button className={`${button.btn} ${flex.justify_start}`} type="button" onClick={e => this.deleteSong(e, song.id, playlist)}>
            <i className="material-icons">close</i>
            Remove from Playlist
          </button>
        )}
        <button className={`${button.btn} ${flex.justify_start}`} type="button" onClick={e => this.deleteSong(e, song.id)}>
          <i className="material-icons">delete</i>
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
