// @flow
/* eslint-disable jsx-a11y/no-static-element-interactions */

import * as React from 'react'
import { connect } from 'react-redux'

import db from '~/db'
import { showPopup } from '~/redux/popup'
import getEventPath from '~/common/getEventPath'
import { setSongPlaylist, incrementNonce, playNext, playLater } from '~/redux/songs'
import { addSongsToPlaylist, deleteSongsFromLibrary } from '~/common/songs'

import '~/css/dropdown.css'

type Props = {|
  activeSong: number,
  showPopup: showPopup,
  playlist: Array<number>,
  songsIds: Array<number>,
  playNext: typeof playNext,
  incrementNonce: () => void,
  playLater: typeof playLater,
  setSongPlaylist: typeof setSongPlaylist,
|}
type State = {|
  opened: boolean,
  playlists: Array<Object> | null,
|}

class Dropdown extends React.Component<Props, State> {
  state = { opened: false, playlists: null }

  async componentDidMount() {
    const playlists = await db.playlists.toArray()
    this.setState({ playlists: playlists })
    document.addEventListener('click', this.handleBodyClick)
    document.addEventListener('keydown', this.handleBodyKeypress)
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

    const opened = this.state.opened
    const firedOnSelf = getEventPath(e).includes(this.ref)
    if (opened || firedOnSelf) {
      this.setState({
        opened: !opened,
      })
    }
  }
  handleBodyKeypress = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && this.state.opened) {
      this.setState({ opened: false })
    }
  }

  deleteSongs = (e: SyntheticEvent<HTMLButtonElement>) => {
    e.preventDefault()
    const { songsIds } = this.props
    if (songsIds.includes(this.props.activeSong)) {
      this.props.playNext()
    }
    deleteSongsFromLibrary(songsIds)
    this.props.incrementNonce()
  }

  render() {
    const { playlists } = this.state
    const { songsIds } = this.props

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
                  playlists.map(playlist => (
                    <button
                      key={playlist.id}
                      className="dropdown-option"
                      onClick={() => addSongsToPlaylist(songsIds, playlist.id)}
                    >
                      {playlist.name}
                    </button>
                  ))}
              </div>
            </React.Fragment>
          </div>
          <button className="dropdown-option">Edit</button>
          <button className="dropdown-option" onClick={this.deleteSongs}>
            Delete
          </button>
          <button className="dropdown-option" onClick={() => this.props.playLater({ ids: songsIds })}>
            Play Later
          </button>
        </div>
      </div>
    )
  }
}

export default connect(
  ({ songs }) => ({ activeSong: songs.playlist[songs.songIndex], playlist: songs.playlist }),
  { setSongPlaylist, showPopup, incrementNonce, playNext, playLater },
)(Dropdown)
