// @flow

import * as React from 'react'
import groupBy from 'lodash/groupBy'
import { connect } from 'react-redux'

import db from '~/db'
import type { File } from '~/types'
import { showPopup } from '~/redux/popup'
import { setSongPlaylist } from '~/redux/songs'
import { addSongsToPlaylist } from '~/common/songs'

import '~/css/content-card.css'

import Dropdown from './Dropdown'
import AlbumInfo from './AlbumInfo'
import SubDropdown from './SubDropdown'

type Props = {|
  songs: Array<Object>,
  selected: ?Object,
  showPopup: showPopup,
  setSongPlaylist: typeof setSongPlaylist,
|}
type State = {|
  playlists: Array<Object> | null,
|}

class ContentCard extends React.Component<Props, State> {
  state = {
    playlists: null,
  }

  async componentDidMount() {
    const playlists = await db.playlists.toArray()
    this.setState({ playlists: playlists })
  }

  render() {
    const { songs, selected } = this.props
    const { playlists } = this.state

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
        <div className="space-between section-artist-header">
          <div>
            <h2>{selected ? selected.identifier : 'All Artists'}</h2>
            <p>
              {Object.keys(songsByAlbums).length} albums, {songsToShow.length} songs
            </p>
          </div>
          <Dropdown>
            <div className="align-center space-between sub-dropdown-trigger">
              <button>Add to Playlist</button>
              <SubDropdown>
                <button
                  onClick={() => this.props.showPopup({ show: true, songsIds: songsIdsArr })}
                  className="dropdown-option"
                >
                  New Playlist
                </button>
                {playlists &&
                  playlists.map(playlist => (
                    <button
                      key={playlist.id}
                      className="dropdown-option"
                      onClick={() => addSongsToPlaylist(songsIdsArr, playlist.id)}
                    >
                      {playlist.name}
                    </button>
                  ))}
              </SubDropdown>
            </div>
            <button className="dropdown-option" onClick={() => this.props.setSongPlaylist(songsIdsArr)}>
              Shuffle All
            </button>
            <button className="dropdown-option">Play Next</button>
            <button className="dropdown-option">Play Later</button>
            <button className="dropdown-option">Delete from Library</button>
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
  { setSongPlaylist, showPopup },
)(ContentCard)
