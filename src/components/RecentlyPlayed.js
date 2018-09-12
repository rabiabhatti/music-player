// @flow

import * as React from 'react'
import { connect } from 'react-redux'

import db from '~/db'
import { setSongPlaylist } from '~/redux/songs'
import { humanizeDuration } from '~/common/songs'

import '~/css/songs.css'
import '~/css/table.css'
import Dropdown from './Dropdown'
import ReplacementText from './ReplacementText'

type Props = {|
  nonce: number,
  activeSong: number | null,
  recentlyPlayed: Array<number>,
  setSongPlaylist: setSongPlaylist,
|}
type State = {|
  songs: Array<Object>,
|}

class RecentlyPlayed extends React.Component<Props, State> {
  state = { songs: [] }

  componentDidMount() {
    this.fetchSongs(this.props.recentlyPlayed.reverse())
  }

  componentDidUpdate(prevProps) {
    if (prevProps.nonce !== this.props.nonce || prevProps.recentlyPlayed.length !== this.props.recentlyPlayed.length) {
      this.fetchSongs(this.props.recentlyPlayed.reverse())
    }
  }

  fetchSongs(idsArr: Array<number>) {
    this.setState({ songs: [] })
    idsArr.forEach(async id => {
      const song = await db.songs.get(id)
      if (song) {
        this.setState(prevState => ({
          songs: [...prevState.songs, song],
        }))
      }
    })
  }
  playAtIndex = (index: number) => {
    this.props.setSongPlaylist({
      songs: this.state.songs.map(song => song.id),
      index,
    })
  }
  render() {
    let i = 0
    const { activeSong } = this.props
    const { songs } = this.state

    return (
      <div className="section-songs bound">
        {songs.length ? (
          <React.Fragment>
            <div className="align-center space-between">
              <h2>Recently Played</h2>
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
                    key={i++}
                    onDoubleClick={() => this.playAtIndex(index)}
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
                      <Dropdown songsIds={[song.id]} song={song} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </React.Fragment>
        ) : (
          <ReplacementText />
        )}
      </div>
    )
  }
}

export default connect(
  ({ songs }) => ({
    nonce: songs.nonce,
    recentlyPlayed: songs.recentlyPlayed,
    activeSong: songs.playlist[songs.songIndex] || null,
  }),
  { setSongPlaylist },
)(RecentlyPlayed)
