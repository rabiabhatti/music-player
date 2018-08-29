// @flow
/* eslint-disable jsx-a11y/no-static-element-interactions */

import * as React from 'react'
import { connect } from 'react-redux'

import db from '~/db'
import getEventPath from '~/common/getEventPath'
import { incrementNonce, playNext, playLater } from '~/redux/songs'
import { addSongsToPlaylist, deleteSongsFromLibrary, deleteSongFromPlaylist } from '~/common/songs'

import EditSong from '~/components/Popup/EditSong'
import CreateNewPlaylist from '~/components/Popup/CreateNewPlaylist'

import '~/css/dropdown.css'

type Props = {|
  nonce: number,
  song?: Object,
  playlist?: Object,
  activeSong: number,
  songsIds: Array<number>,
  playNext: typeof playNext,
  incrementNonce: () => void,
  playLater: typeof playLater,
|}
type State = {|
  opened: boolean,
  showEditModal: boolean,
  playlists: Array<Object> | null,
  showCreatePlaylistModal: boolean,
|}

class Dropdown extends React.Component<Props, State> {
  state = { opened: false, showEditModal: false, playlists: null, showCreatePlaylistModal: false }

  componentDidMount() {
    this.fetchPlaylists()
    document.addEventListener('click', this.handleBodyClick)
    document.addEventListener('keydown', this.handleBodyKeypress)
  }

  async componentWillReceiveProps(nextProps) {
    if (nextProps.nonce !== this.props.nonce) {
      this.setState({ playlists: null })
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

  showEditModal = () => {
    this.setState({ showEditModal: true })
  }
  hideEditModal = () => {
    this.setState({ showEditModal: false })
  }
  showCreatePlaylistModal = () => {
    this.setState({ showCreatePlaylistModal: true })
  }
  hideCreatePlaylistModal = () => {
    this.setState({ showCreatePlaylistModal: false })
  }

  render() {
    const { songsIds, playlist, song } = this.props
    const { playlists, showEditModal, showCreatePlaylistModal } = this.state

    return (
      <div
        className="section-dropdown"
        ref={element => {
          this.ref = element
        }}
      >
        {showEditModal && <EditSong handleClose={this.hideEditModal} song={song} />}
        {showCreatePlaylistModal && <CreateNewPlaylist handleClose={this.hideCreatePlaylistModal} songsIds={songsIds} />}
        <i className="material-icons song-dropdown">more_horiz</i>
        <div className={`dropdown-content ${this.state.opened ? '' : 'hidden'}`}>
          <div className="align-center space-between sub-dropdown-trigger">
            <button className="btn-dull">Add to Playlist</button>
            <i className="material-icons">arrow_right</i>
            <React.Fragment>
              <div className="sub-dropdown-content dropdown-content hidden">
                <button onClick={() => this.showCreatePlaylistModal()} className="dropdown-option">
                  New Playlist
                </button>
                {playlists &&
                  playlists.map(localPlaylist => (
                    <button
                      key={localPlaylist.id}
                      className="dropdown-option"
                      onClick={() => addSongsToPlaylist(songsIds, localPlaylist.id)}
                    >
                      {localPlaylist.name}
                    </button>
                  ))}
              </div>
            </React.Fragment>
          </div>
          <button
            onClick={() => {
              this.showEditModal()
            }}
            className="dropdown-option"
          >
            Edit
          </button>
          <button className="dropdown-option" onClick={() => this.props.playLater({ ids: songsIds })}>
            Play Later
          </button>
          {playlist && (
            <button className="dropdown-option" onClick={e => this.deleteSong(e, 'playlist')}>
              Remove from Playlist
            </button>
          )}

          <button className="dropdown-option" onClick={e => this.deleteSong(e, 'library')}>
            Delete from Library
          </button>
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
