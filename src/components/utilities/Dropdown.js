// @flow
/* eslint-disable jsx-a11y/no-static-element-interactions */

import * as React from 'react'
import connect from '~/common/connect'

import db from '~/db'
import getEventPath from '~/common/getEventPath'
import { incrementNonce, playNext, playLater } from '~/redux/songs'
import { addSongsToPlaylist, deleteSongsFromLibrary, deleteSongFromPlaylist } from '~/common/songs'

import '~/styles/dropdown.less'
import EditSong from '~/components/utilities/Popup/EditSong'
import EditAlbum from '~/components/utilities/Popup/EditAlbum'
import CreateNewPlaylist from '~/components/utilities/Popup/CreateNewPlaylist'

type Props = {|
  nonce: number,
  song?: Object,
  album?: string,
  playlist?: Object,
  activeSong: number,
  songsIds: Array<number>,
  playNext: typeof playNext,
  incrementNonce: () => void,
  playLater: typeof playLater,
|}
type State = {|
  opened: boolean,
  showEditSongModal: boolean,
  showEditAlbumModal: boolean,
  playlists: Array<Object> | null,
  showCreatePlaylistModal: boolean,
|}

class Dropdown extends React.Component<Props, State> {
  state = {
    opened: false,
    showEditSongModal: false,
    showEditAlbumModal: false,
    playlists: null,
    showCreatePlaylistModal: false,
  }

  componentDidMount() {
    this.fetchPlaylists()
    document.addEventListener('click', this.handleBodyClick)
    document.addEventListener('keydown', this.handleBodyKeypress)
  }

  componentDidUpdate(prevProps) {
    if (prevProps.nonce !== this.props.nonce) {
      this.fetchPlaylists()
    }
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleBodyClick)
    document.removeEventListener('keydown', this.handleBodyKeypress)
  }

  ref: ?HTMLDivElement = null

  handleBodyClick = (e: MouseEvent) => {
    if (e.defaultPrevented) {
      return
    }

    const localOpened = this.state.opened
    const firedOnSelf = getEventPath(e).includes(this.ref)
    if (localOpened || firedOnSelf) {
      this.setState({
        opened: !localOpened,
      })
    }
  }
  handleBodyKeypress = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && this.state.opened) {
      this.setState({ opened: false })
    }
  }

  fetchPlaylists = async () => {
    const playlists = await db.playlists.toArray()
    this.setState({ playlists })
  }

  deleteSong = (e: SyntheticEvent<HTMLButtonElement>, type: string) => {
    e.preventDefault()
    const { songsIds, playlist } = this.props
    if (songsIds.includes(this.props.activeSong)) {
      this.props.playNext()
    }
    if (type === 'playlist' && playlist) {
      deleteSongFromPlaylist(playlist, songsIds[0])
    } else {
      deleteSongsFromLibrary(songsIds)
    }
    this.props.incrementNonce()
  }

  showEditSongModal = () => {
    this.setState({ showEditSongModal: true })
  }
  hideEditSongModal = () => {
    this.setState({ showEditSongModal: false })
  }
  showEditAlbumModal = () => {
    this.setState({ showEditAlbumModal: true })
  }
  hideEditAlbumModal = () => {
    this.setState({ showEditAlbumModal: false })
  }
  showCreatePlaylistModal = () => {
    this.setState({ showCreatePlaylistModal: true })
  }
  hideCreatePlaylistModal = () => {
    this.setState({ showCreatePlaylistModal: false })
  }

  render() {
    const { songsIds, playlist, song, album } = this.props
    const { playlists, showEditSongModal, showCreatePlaylistModal, showEditAlbumModal } = this.state

    return (
      <div
        className="section-dropdown align-center"
        ref={element => {
          this.ref = element
        }}
      >
        {showEditSongModal && <EditSong handleClose={this.hideEditSongModal} song={song} />}
        {showEditAlbumModal && <EditAlbum handleClose={this.hideEditAlbumModal} album={songsIds} />}
        {showCreatePlaylistModal && <CreateNewPlaylist handleClose={this.hideCreatePlaylistModal} songsIds={songsIds} />}
        <i className="material-icons btn-blue">more_horiz</i>
        <div className={`dropdown-content ${this.state.opened ? '' : 'hidden'}`}>
          <button className="btn-dull space-between">
            Add to Playlist
            <i className="material-icons">add</i>
          </button>
          <div className="sub-dropdown-content dropdown-content hidden">
            <button onClick={() => this.showCreatePlaylistModal()}>New Playlist</button>
            {playlists &&
              playlists.map(localPlaylist => (
                <button key={localPlaylist.id} onClick={() => addSongsToPlaylist(songsIds, localPlaylist.id)}>
                  {localPlaylist.name}
                </button>
              ))}
          </div>
          {song && (
            <button
              onClick={() => {
                this.showEditSongModal()
              }}
            >
              Edit
            </button>
          )}
          {album && (
            <button
              onClick={() => {
                this.showEditAlbumModal()
              }}
            >
              Edit Album
            </button>
          )}
          <button onClick={() => this.props.playLater(songsIds)}>Play Later</button>
          {playlist && <button onClick={e => this.deleteSong(e, 'playlist')}>Remove from Playlist</button>}
          <button onClick={e => this.deleteSong(e, 'library')}>Delete from Library</button>
        </div>
      </div>
    )
  }
}

export default connect(
  ({ songs }) => ({
    activeSong: songs.playlist[songs.songIndex],
    nonce: songs.nonce,
  }),
  { incrementNonce, playNext, playLater },
)(Dropdown)
