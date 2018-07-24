// @flow

import * as React from 'react'

import db from '~/db'

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
                <td>{song.filename}</td>
                <td>{song.duration}</td>
                <td>{song.artwork.artist ? song.artwork.artist : 'Unknown'}</td>
                <td>{song.artwork.album ? song.artwork.album : 'Unknown'}</td>
                <td>{song.meta.genre ? song.meta.genre : 'Unknown'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }
}
