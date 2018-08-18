// @flow

import * as React from 'react'
import groupBy from 'lodash/groupBy'
import { connect } from 'react-redux'

import db from '~/db'
import type { File } from '~/types'
import { setSongPlaylist } from '~/redux/songs'
import { addSongsToPlaylist } from '~/common/songs'

import Popup from './Popup'
import Dropdown from './Dropdown'
import AlbumInfo from './AlbumInfo'
import SubDropdown from './SubDropdown'

type Props = {|
  songs: Array<Object>,
  selected: ?Object,
  setSongPlaylist: typeof setSongPlaylist,
|}
type State = {|
  playlists: Array<Object> | null,
  showPlaylistPopup: number | null,
|}

class ContentCard extends React.Component<Props, State> {
  state = {
    playlists: null,
    showPlaylistPopup: null,
  }

  async componentDidMount() {
    const playlists = await db.playlists.toArray()
    this.setState({ playlists: playlists })
  }

  showPlaylistPopupInput = (e: SyntheticInputEvent<HTMLInputElement>) => {
    e.preventDefault()
    this.setState({ showPlaylistPopup: Date.now() })
  }

  render() {
    const { songs, selected } = this.props
    const { showPlaylistPopup, playlists } = this.state

    let songsToShow = songs
    if (selected) {
      if (selected.type === 'artist') {
        songsToShow = songs.filter(item => item.meta && item.meta.artists.includes(selected.identifier))
      } else if (selected.type === 'genre') {
        songsToShow = songs.filter(item => item.meta && item.meta.genre && item.meta.genre.includes(selected.identifier))
      }
    }
    const songsByAlbums = groupBy(songsToShow, 'meta.album')

    let songsIdsArr = []
    songsToShow.forEach(song => {
      songsIdsArr.push(song.id)
    })

    return (
      <div className="section-artist" id={selected ? selected.identifier : 'allArtists'}>
        {showPlaylistPopup && <Popup hash={showPlaylistPopup.toString()} songsIds={songsIdsArr} />}
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
                {playlists &&
                  playlists.map(playlist => (
                    <a
                      key={playlist.id}
                      className="dropdown-option"
                      onClick={() => addSongsToPlaylist(songsIdsArr, playlist.id)}
                    >
                      {playlist.name}
                    </a>
                  ))}
              </SubDropdown>
            </div>
            <a className="dropdown-option" onClick={() => this.props.setSongPlaylist(songsIdsArr)}>
              Shuffle All
            </a>
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

export default connect(
  null,
  { setSongPlaylist },
)(ContentCard)
