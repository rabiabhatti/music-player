// @flow

import * as React from 'react'
import { connect } from 'react-redux'

import db from '~/db'
import { humanizeDuration } from '~/common/songs'
import { setSongPlaylist } from '~/redux/songs'

import '~/css/songs.css'
import '~/css/table.css'
import Dropdown from './Dropdown'

type Props = {|
  nonce: number,
  route: {|
    name: string,
    id: number,
  |},
  activeSong: number | null,
  setSongPlaylist: typeof setSongPlaylist,
|}
type State = {|
  index: number,
  playlist: Object,
  songs: Array<Object>,
|}

class Playlist extends React.Component<Props, State> {
  state = { playlist: {}, songs: [], index: 0 }

  componentDidMount() {
    this.getPlaylist(this.props.route.id)
    document.addEventListener('dblclick', this.handleDoubleClick)
  }

  async componentWillReceiveProps(nextProps) {
    const oldPlaylist = this.props.route.id
    const newPlaylist = nextProps.route.id

    if (newPlaylist !== oldPlaylist) {
      this.getPlaylist(newPlaylist)
    }

    if (nextProps.nonce !== this.props.nonce) {
      this.getPlaylist(this.props.route.id)
    }
  }

  componentWillUnmount() {
    document.removeEventListener('dblclick', this.handleDoubleClick)
  }

  getPlaylist = async (playlistId: number) => {
    this.setState({ songs: [] })
    const playlist = await db.playlists.get(playlistId)
    if (playlist.songs.length) {
      playlist.songs.forEach(async id => {
        const song = await db.songs.get(id)
        if (song) {
          this.setState(prevState => ({
            playlist,
            songs: [...prevState.songs, song],
          }))
        }
      })
    }
  }

  handleDoubleClick = (e: MouseEvent) => {
    e.preventDefault()
    this.playAtIndex(this.state.index)
  }

  playAtIndex = (index: number) => {
    this.props.setSongPlaylist({
      songs: this.state.songs.map(song => song.id),
      index,
    })
  }

  render() {
    const { activeSong } = this.props
    const { songs, playlist } = this.state

    const songsIdsArr = []
    this.state.songs.forEach(song => {
      songsIdsArr.push(song.id)
    })

    return (
      <React.Fragment>
        {songs.length ? (
          <div className="section-songs bound">
            <div className="align-center space-between">
              <h2>{playlist.name}</h2>
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
                    <td>{!song.duration ? '' : humanizeDuration(song.duration)}</td>
                    <td>{song.meta.artists_original || 'Unknown'}</td>
                    <td>{song.meta.album || 'Unknown'}</td>
                    <td>{song.meta.genre || 'Unknown'} </td>
                    <td className="song-wrapper-btns space-between">
                      <button onClick={() => this.playAtIndex(index)}>
                        <i className="material-icons btn-blue">play_arrow</i>
                      </button>
                      <Dropdown songsIds={[song.id]} playlist={playlist} song={song} />
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
  ({ router, songs }) => ({
    route: router.route,
    nonce: songs.nonce,
    activeSong: songs.playlist[songs.songIndex] || null,
  }),
  { setSongPlaylist },
)(Playlist)
