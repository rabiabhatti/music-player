// @flow

import * as React from 'react'
import { connect } from 'react-redux'

import db from '~/db'
import { humanizeDuration } from '~/common/songs'
import { songToPlay, songsListToPlay } from '~/redux/songs'

type Props = {|
  songToPlay: typeof songToPlay,
  songsListToPlay: typeof songsListToPlay,
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

  render() {
    console.log(this.state.songs)
    return (
      <div className="section-songs bound">
        {this.state.songs.length ? (
          <React.Fragment>
            <div className="align-center space-between">
              <h2>Songs</h2>
              <button onClick={() => this.props.songsListToPlay(this.state.songs)}>Play All</button>
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
                  <tr
                    key={song.sourceId}
                    style={{ cursor: 'pointer' }}
                    onClick={() =>
                      this.props.songToPlay({
                        name:
                          song.meta && typeof song.meta.name !== 'undefined'
                            ? song.meta.name
                            : song.filename.replace('.mp3', ''),
                        sourceId: song.sourceId,
                        sourceUid: song.sourceUid,
                        artists: song.meta.artists.length === 0 ? 'Unknown' : song.meta.artists.join(', '),
                      })
                    }
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
            </table>{' '}
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

export default connect(null, { songToPlay, songsListToPlay })(Songs)
