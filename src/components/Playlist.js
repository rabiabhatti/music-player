// @flow

import * as React from 'react'
import { connect } from 'react-redux'

import db from '~/db'
import { humanizeDuration } from '~/common/songs'
import { setSongPlaylist, incrementNonce } from '~/redux/songs'

type Props = {|
  playlist: Object,
  incrementNonce: () => void,
  setSongPlaylist: typeof setSongPlaylist,
|}
type State = {|
  playlist: Object,
  songs: Array<Object>,
|}

class Playlist extends React.Component<Props, State> {
  state = { playlist: {}, songs: [] }

  async componentDidMount() {
    const playlist = await db.playlists.get(this.props.route.id)
    this.setState({ playlist })

    this.getPlaylistSongs(playlist)
  }

  async componentWillReceiveProps(nextProps) {
    const oldPlaylist = this.props.route.id
    const newPlaylist = nextProps.playlist.id

    if (newPlaylist !== oldPlaylist) {
      const playlist = await db.playlists.get(newPlaylist)
      this.setState({ playlist })
      this.setState({ songs: [] })

      this.getPlaylistSongs(playlist)
    }
  }

  getPlaylistSongs = (playlist: Object) => {
    if (playlist.songs.length) {
      playlist.songs.forEach(async songsId => {
        const song = await db.songs.get(songsId)
        if (song) {
          this.setState(prevState => ({
            songs: [...prevState.songs, song],
          }))
          this.props.incrementNonce()
        }
      })
    }
  }

  handleSongPlayAllInput = () => {
    const songsList = this.state.songs
    const songsIdsArr = []
    songsList.forEach(song => {
      songsIdsArr.push(song.id)
    })
    this.props.setSongPlaylist(songsIdsArr)
  }

  render() {
    const { songs, playlist } = this.state

    return (
      <React.Fragment>
        {songs.length ? (
          <div className="section-songs bound">
            <div className="align-center space-between">
              <h2>{playlist.name}</h2>
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
          </div>
        ) : (
          <div className="align-center justify-center bound" style={{ height: 300 }}>
            <h2 className="replacement-text">Add Music</h2>
          </div>
        )}
      </React.Fragment>
    )
  }
}

export default connect(
  ({ router }) => ({ route: router.route }),
  { setSongPlaylist, incrementNonce },
)(Playlist)
