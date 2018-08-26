// @flow

import * as React from 'react'
import { connect } from 'react-redux'

import db from '~/db'
import type { RouterRoute } from '~/redux/router'
import { humanizeDuration } from '~/common/songs'
import { setSongPlaylist, incrementNonce } from '~/redux/songs'

import '~/css/songs.css'
import '~/css/table.css'
import Dropdown from './Dropdown'

type Props = {|
  nonce: number,
  playlist: Object,
  route: RouterRoute,
  activeSong: number | null,
  incrementNonce: () => void,
  setSongPlaylist: typeof setSongPlaylist,
|}
type State = {|
  index: number,
  playlist: Object,
  songs: Array<Object>,
|}

class Playlist extends React.Component<Props, State> {
  state = { playlist: {}, songs: [], index: 0 }

  async componentDidMount() {
    const playlist = await db.playlists.get(this.props.route.id)
    this.setState({ playlist })

    this.fetchSongs(playlist)
    document.addEventListener('dblclick', this.handleDblClick)
  }

  async componentWillReceiveProps(nextProps) {
    const oldPlaylist = this.props.route.id
    const newPlaylist = nextProps.route.id

    const playlist = await db.playlists.get(newPlaylist)
    if (newPlaylist !== oldPlaylist) {
      this.setState({ playlist })
      this.setState({ songs: [] })

      this.fetchSongs(playlist)
      return
    }

    if (nextProps.nonce !== this.props.nonce) {
      this.fetchSongs(playlist)
      return
    }
  }

  fetchSongs = (playlist: Object) => {
    if (playlist.songs.length) {
      playlist.songs.forEach(async songsId => {
        const song = await db.songs.get(songsId)
        if (song) {
          this.setState(prevState => ({
            songs: [...prevState.songs, song],
          }))
        }
      })
    }
  }

  componentWillUnmount() {
    document.removeEventListener('dblclick', this.handleDblClick)
  }

  handleDblClick = (e: MouseEvent) => {
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
  { setSongPlaylist, incrementNonce },
)(Playlist)
