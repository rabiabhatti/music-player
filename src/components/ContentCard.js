// @flow

import React from 'react'
import groupBy from 'lodash/groupBy'

import type { File } from '~/services/types'

import Popup from './Popup'
import Dropdown from './Dropdown'
import AlbumInfo from './AlbumInfo'
import SubDropdown from './SubDropdown'

type Props = {|
  songs: Array<File>,
  selected: ?Object,
|}
type State = {|
  showPlaylistPopup: number | null,
|}

export default class ContentCard extends React.Component<Props, State> {
  state = {
    showPlaylistPopup: null,
  }

  showPlaylistPopupInput = (e: SyntheticInputEvent<HTMLInputElement>) => {
    e.preventDefault()
    this.setState({ showPlaylistPopup: Date.now() })
  }
  render() {
    const { songs, selected } = this.props
    const { showPlaylistPopup } = this.state

    let songsToShow = songs
    if (selected) {
      if (selected.type === 'artist') {
        songsToShow = songs.filter(item => item.meta && item.meta.artists.includes(selected.identifier))
      } else if (selected.type === 'genre') {
        songsToShow = songs.filter(item => item.meta && item.meta.genre && item.meta.genre.includes(selected.identifier))
      }
    }
    const songsByAlbums = groupBy(songsToShow, 'meta.album')
    return (
      <div className="section-artist" id={selected ? selected.identifier : 'allArtists'}>
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
            <h2>{selected ? selected.identifier : 'All Artists'}</h2>
            <p>
              {Object.keys(songsByAlbums).length} albums, {songsToShow.length} songs
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
        {Object.keys(songsByAlbums).map(albumName => (
          <AlbumInfo name={albumName} key={albumName} songs={songsByAlbums[albumName]} />
        ))}
      </div>
    )
  }
}
