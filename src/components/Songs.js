// @flow

import * as React from 'react'
import { connect } from 'react-redux'

import '~/css/songs.css'
import '~/css/table.css'

import db from '~/db'
import { setSongPlaylist } from '~/redux/songs'
import { humanizeDuration, addSongsToPlaylist } from '~/common/songs'

import Dropdown from './Dropdown'

type Props = {|
  nonce: number,
  activeSong: number | null,
  setSongPlaylist: setSongPlaylist,
|}
type State = {|
  index: number,
  songs: Array<Object>,
|}

class Songs extends React.Component<Props, State> {
  state = { songs: [], index: 0 }

  componentDidMount() {
    this.fetchSongs()
    document.addEventListener('dblclick', this.handleDblClick)
  }

  componentWillReceiveProps(newProps) {
    if (newProps.nonce !== this.props.nonce) {
      this.fetchSongs()
    }
  }

  componentWillUnmount() {
    document.removeEventListener('dblclick', this.handleDblClick)
  }

  handleDblClick = (e: MouseEvent) => {
    e.preventDefault()
    this.playAtIndex(this.state.index)
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
    const { activeSong } = this.props
    const { songs } = this.state

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
              <button className="btn-blue" onClick={() => this.playAtIndex(0)}>
                Play All
              </button>
            </div>
            <table className="section-songs-table" cellSpacing="0">
              <thead>
                <tr className="table-heading">
                  <th>Title</th>
                  <th>Time</th>
                  <th>Artist</th>
                  <th>Album</th>
                  <th>Genre</th>
                </tr>
              </thead>
              <tbody>
                {songs.map((song, index) => (
                  <tr
                    key={song.sourceId}
                    onClick={() => this.setState({ index })}
                    className={song.id === activeSong ? 'active-song song-wrapper' : 'song-wrapper'}
                  >
                    <td>{song.meta.name || song.filename}</td>
                    <td>{humanizeDuration(song.duration)}</td>
                    <td>{song.meta.artists_original || 'Unknown'}</td>
                    <td>{song.meta.album || 'Unknown'}</td>
                    <td>{song.meta.genre || 'Unknown'} </td>
                    <td className="song-wrapper-btns space-between">
                      <button onClick={() => this.playAtIndex(index)}>
                        <i className="material-icons song-play-btn btn-blue">play_arrow</i>
                      </button>
                      <Dropdown songsIds={song.id} />
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
  { setSongPlaylist },
)(Songs)
