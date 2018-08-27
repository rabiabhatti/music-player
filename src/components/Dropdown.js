// @flow
/* eslint-disable jsx-a11y/no-static-element-interactions */

import * as React from 'react'
import { connect } from 'react-redux'

import db from '~/db'
import { showPopup } from '~/redux/popup'
import getEventPath from '~/common/getEventPath'
import { incrementNonce, playNext, playLater } from '~/redux/songs'
import { addSongsToPlaylist, deleteSongsFromLibrary, deleteSongFromPlaylist } from '~/common/songs'

import '~/css/dropdown.css'

type Props = {|
  nonce: number,
  playlist?: Object,
  activeSong: number,
  showPopup: showPopup,
  songsIds: Array<number>,
  playNext: typeof playNext,
  incrementNonce: () => void,
  playLater: typeof playLater,
|}
type State = {|
  opened: boolean,
  playlists: Array<Object> | null,
|}

class Dropdown extends React.Component<Props, State> {
  state = { opened: false, playlists: null }

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
      deleteSongsFromLibrary(songsIds, playlist)
    }

    this.props.incrementNonce()
  }

  render() {
    const { playlists } = this.state
    const { songsIds, playlist } = this.props

    return (
      <div
        className="section-dropdown"
        ref={element => {
          this.ref = element
        }}
      >
        <i className="material-icons song-dropdown">more_horiz</i>
        <div className={`dropdown-content ${this.state.opened ? '' : 'hidden'}`}>
          <div className="align-center space-between sub-dropdown-trigger">
            <button className="btn-dull">Add to Playlist</button>
            <i className="material-icons">arrow_right</i>
            <React.Fragment>
              <div className="sub-dropdown-content dropdown-content hidden">
                <button
                  onClick={() =>
                    this.props.showPopup({
                      show: true,
                      songsIds,
                    })
                  }
                  className="dropdown-option"
                >
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
          <button className="dropdown-option">Edit</button>
          <button className="dropdown-option" onClick={() => this.props.playLater({ ids: songsIds })}>
            Play Later
          </button>
          {playlist && (
            <button className="dropdown-option" onClick={e => this.deleteSong(e, 'playlist')}>
              Delete from Playlist
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
  ({ songs }) => ({ activeSong: songs.playlist[songs.songIndex], nonce: songs.nonce }),
  { showPopup, incrementNonce, playNext, playLater },
)(Dropdown)
