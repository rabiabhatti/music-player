// @flow

import * as React from 'react'
import { connect } from 'react-redux'

import db from '~/db'
import { humanizeDuration } from '~/common/songs'
import { setSongPlaylist } from '~/redux/songs'

type Props = {|
  setSongPlaylist: typeof setSongPlaylist,
|}
type State = {|
  songs: Array<Object>,
|}

class Songs extends React.Component<Props, State> {
  state = { songs: [] }

  async componentDidMount() {
    const dbSongs = await db.songs.toArray()
    this.setState({ songs: dbSongs })
  }

  handleSongPlayAllInput = () => {
    const songsList = this.state.songs
    let songsIdsArr = []
    songsList.forEach(song => {
      songsIdsArr.push(song.id)
    })
    this.props.setSongPlaylist(songsIdsArr)
  }

  render() {
    const { songs } = this.state
    return (
      <div className="section-songs bound">
        {songs.length ? (
          <React.Fragment>
            <div className="align-center space-between">
              <h2>Songs</h2>
              <button onClick={this.handleSongPlayAllInput}>Play All</button>
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
                {songs.map(song => (
                  <tr
                    key={song.sourceId}
                    style={{ cursor: 'pointer' }}
                    onClick={() => this.props.setSongPlaylist([song.id])}
                  >
                    <td>
                      {song.meta && typeof song.meta.name !== 'undefined'
                        ? song.meta.name
                        : song.filename.replace('.mp3', '')}
                    </td>
                    <td>{humanizeDuration(song.duration)}</td>
                    <td>
                      {song.meta && song.meta.artists.length === 0 ? 'Unknown' : song.meta && song.meta.artists.join(', ')}
                    </td>
                    <td>{song.meta && song.meta.album ? song.meta && song.meta.album : 'Unknown'}</td>
                    <td>
                      {(song.meta && typeof song.meta.genre === 'undefined') || (song.meta && song.meta.genre[0] === '')
                        ? 'Unkown'
                        : song.meta && song.meta.genre}
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

export default connect(null, { setSongPlaylist })(Songs)
