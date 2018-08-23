// @flow
/* eslint-disable jsx-a11y/no-static-element-interactions */

import * as React from 'react'
import { connect } from 'react-redux'

import db from '~/db'
import { showPopup } from '~/redux/popup'
import getEventPath from '~/common/getEventPath'
import { addSongsToPlaylist } from '~/common/songs'
import { setSongPlaylist } from '~/redux/songs'

import '~/css/dropdown.css'

type Props = {|
  showPopup: showPopup,
  songsIds: Array<number>,
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
            <i className="material-icons">play_arrow</i>
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
          <button className="dropdown-option">Play Next</button>
          <button className="dropdown-option">Play Later</button>
          <button className="dropdown-option">Delete from Library</button>
        </div>
      </div>
    )
  }
}

export default connect(
  null,
  { setSongPlaylist, showPopup },
)(Dropdown)
