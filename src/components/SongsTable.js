// @flow

import * as React from 'react'
import connect from '~/common/connect'

import '~/styles/table.less'
import { setSongPlaylist } from '~/redux/songs'
import { humanizeDuration } from '~/common/songs'

import Dropdown from './Dropdown'

type Props = {|
  title: string,
  songs: Array<Object>,
  activeSong: number | null,
  setSongPlaylist: setSongPlaylist,
|}

type State = {||}

class SongsTable extends React.Component<Props, State> {
  playAtIndex = (index: number) => {
    this.props.setSongPlaylist({
      songs: this.props.songs.map(song => song.id),
      index,
    })
  }

  render() {
    const { activeSong, songs, title } = this.props

    return (
      <div className="section-songs bound">
        <div className="align-center space-between">
          <h2>{title}</h2>
          <button className="btn-blue" onClick={() => this.playAtIndex(0)}>
            Play All
          </button>
        </div>
        <table cellSpacing="0">
          <thead>
            <tr>
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
                key={song.id}
                onDoubleClick={() => this.playAtIndex(index)}
                className={song.id === activeSong ? 'active-song' : ''}
              >
                <td>{song.meta.name || song.filename}</td>
                <td>{song.duration ?  humanizeDuration(song.duration) : ''}</td>
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
      </div>
    )
  }
}

export default connect(
  ({ songs }) => ({
    activeSong: songs.playlist[songs.songIndex] || null,
  }),
  { setSongPlaylist },
)(SongsTable)
