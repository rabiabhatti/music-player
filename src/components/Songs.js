// @flow

import * as React from 'react'

import db from '~/db'
import { humanizeDuration } from '~/common/songs'

type Props = {||}
type State = {|
  songs: Array<Object>,
|}

export default class Songs extends React.Component<Props, State> {
  state = { songs: [] }
  async componentDidMount() {
    const dbSongs = await db.songs.toArray()
    this.setState({ songs: dbSongs })
  }

  render() {
    return (
      <div className="section-songs bound">
        <div className="align-center space-between">
          <h2>Songs</h2>
          <button>Play All</button>
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
            {this.state.songs.map(song => (
              <tr key={song.sourceId}>
                <td>
                  {song.meta && typeof song.meta.name !== 'undefined' ? song.meta.name : song.filename.replace('.mp3', '')}
                </td>
                <td>{humanizeDuration(song.duration)}</td>
                <td>{song.meta.artists.length === 0 ? 'Unknown' : song.meta.artists.join(', ')}</td>
                <td>{song.meta.album ? song.meta.album : 'Unknown'}</td>
                <td>{typeof song.meta.genre === 'undefined' || song.meta.genre[0] === '' ? 'Unkown' : song.meta.genre}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }
}
