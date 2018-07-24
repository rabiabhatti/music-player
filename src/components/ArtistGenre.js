// @flow

import React from 'react'

import Popup from './Popup'
import Dropdown from './Dropdown'
import SubDropdown from './SubDropdown'

type Props = {|
  children?: React$Node,
  id: string,
  name: string,
  albumsCount: number,
  songsCount: number,
|}
type State = {|
  showPlaylistPopup: number | null,
|}

export default class ArtistGenre extends React.Component<Props, State> {
  state = {
    showPlaylistPopup: null,
  }

  showPlaylistPopupInput = (e: SyntheticInputEvent<HTMLInputElement>) => {
    e.preventDefault()
    this.setState({ showPlaylistPopup: Date.now() })
  }
  render() {
    const { children, id, name, albumsCount, songsCount } = this.props
    const { showPlaylistPopup } = this.state
    return (
      <div className="section-artist" id={id}>
        {showPlaylistPopup ? (
          <Popup hash={showPlaylistPopup.toString()}>
            <input type="text" placeholder="Choose name" />
            <button className="btn-blue">Save</button>
          </Popup>
        ) : (
          <div />
        )}
        <div className="space-between section-artist-header">
          <div>
            <h2>{name}</h2>
            <p>
              {albumsCount} albums, {songsCount} songs
            </p>
          </div>
          <Dropdown>
            <div className="align-center space-between sub-dropdown-trigger">
              <a>Add to Playlist</a>
              <SubDropdown>
                <a onClick={this.showPlaylistPopupInput} className="dropdown-option">
                  New Playlist
                </a>
                <a className="dropdown-option">90's</a>
                <a className="dropdown-option">Peace of Mind</a>
                <a className="dropdown-option">Rock n Roll</a>
              </SubDropdown>
            </div>
            <a className="dropdown-option">Shuffle All</a>
            <a className="dropdown-option">Play Next</a>
            <a className="dropdown-option">Play Later</a>
            <a className="dropdown-option">Delete from Library</a>
          </Dropdown>
        </div>
        <div className="artist-info">{children}</div>
      </div>
    )
  }
}
