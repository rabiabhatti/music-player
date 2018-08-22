// @flow

import * as React from 'react'
import { connect } from 'react-redux'

import '~/css/songs.css'
import '~/css/table.css'

import db from '~/db'
import { humanizeDuration, addSongsToPlaylist } from '~/common/songs'
import { setSongPlaylist } from '~/redux/songs'
import { showPopup } from '~/redux/popup'

import Popup from './Popup'
import Dropdown from './Dropdown'
import SubDropdown from './SubDropdown'

type Props = {|
  nonce: number,
  showPopup: showPopup,
  activeSong: number | null,
  setSongPlaylist: setSongPlaylist,
|}
type State = {|
  songs: Array<Object>,
  playlists: Array<Object> | null,
|}

class Songs extends React.Component<Props, State> {
  state = { songs: [], playlists: null }

  async componentDidMount() {
    this.fetchSongs()
    const playlists = await db.playlists.toArray()
    this.setState({ playlists: playlists })
  }
  componentWillReceiveProps(newProps) {
    if (newProps.nonce !== this.props.nonce) {
      this.fetchSongs()
    }
  }

  fetchSongs() {
    db.songs
      .where('state')
      .equals('downloaded')
      .toArray()
      .then(songs => {
        this.setState({ songs })
      })
  }

  playAtIndex = (index: number) => {
    this.props.setSongPlaylist({
      songs: this.state.songs.map(song => song.id),
      index,
    })
  }

  render() {
    let i = 1
    const { activeSong } = this.props
    const { songs, playlists } = this.state

    let songsIdsArr = []
    songs.forEach(song => {
      songsIdsArr.push(song.id)
    })

    return (
      <div className="section-songs bound">
        {songs.length ? (
          <React.Fragment>
            <div className="align-center space-between">
              <h2>Songs</h2>
              <button onClick={() => this.playAtIndex(0)}>Play All</button>
            </div>
            <table className="section-songs-table" cellSpacing="0">
              <thead>
                <tr className="table-heading">
                  <th>Title</th>
                  <th>Time</th>
                  <th>Artist</th>
                  <th>Album</th>
                  <th>Genre</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {songs.map((song, index) => (
                  <tr
                    key={song.sourceId}
                    style={{ cursor: 'pointer' }}
                    onClick={() => this.playAtIndex(index)}
                    className={song.id === activeSong ? 'active' : ''}
                  >
                    <td>{song.meta.name || song.filename}</td>
                    <td>{humanizeDuration(song.duration)}</td>
                    <td>{song.meta.artists_original || 'Unknown'}</td>
                    <td>{song.meta.album || 'Unknown'}</td>
                    <td>{song.meta.genre || 'Unknown'} </td>
                    <td>
                      <Dropdown>
                        <div className="align-center space-between sub-dropdown-trigger">
                          <a>Add to Playlist</a>
                          <SubDropdown>
                            <button
                              onClick={() =>
                                this.props.showPopup({
                                  show: true,
                                  songsIds: songsIdsArr,
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
                                  onClick={() => addSongsToPlaylist([song.id], playlist.id)}
                                >
                                  {playlist.name}
                                </button>
                              ))}
                          </SubDropdown>
                        </div>
                        <button className="dropdown-option">Play Next</button>
                        <button className="dropdown-option">Play Later</button>
                        <button className="dropdown-option">Delete from Library</button>
                      </Dropdown>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </React.Fragment>
        ) : (
          <div className="align-center justify-center" style={{ height: 300 }}>
            <h2 className="replacement-text">Add Music</h2>
          </div>
        )}
      </div>
    )
  }
}

export default connect(
  ({ songs }) => ({
    nonce: songs.nonce,
    activeSong: songs.playlist[songs.songIndex] || null,
  }),
  { setSongPlaylist, showPopup },
)(Songs)
