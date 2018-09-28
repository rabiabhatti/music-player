// @flow

import * as React from 'react'
import connect from '~/common/connect'

import { setSongPlaylist } from '~/redux/songs'
import { humanizeDuration } from '~/common/songs'

import flex from '~/less/flex.less'
import button from '~/less/button.less'
import table from '~/less/table.less'
import SongDropdown from '~/components/Dropdown/SongDropdown'

type Props = {|
  title: string,
  playlist?: Object,
  songState: string,
  songs: Array<Object>,
  activeSong: number | null,
  setSongPlaylist: setSongPlaylist,
|}

type State = {||}

class SongsTable extends React.Component<Props, State> {
  playAtIndex = (index: number) => {
    const { songs, setSongPlaylist: setSongPlaylistProp } = this.props
    setSongPlaylistProp({
      songs: songs.map(song => song.id),
      index,
    })
  }

  render() {
    const { activeSong, songs, title, playlist, songState } = this.props

    return (
      <div className={`${table.section_songs} bound`}>
        <div className="align-center space-between">
          <h2>{title}</h2>
          <button type="button" className={`${button.btn} ${button.btn_playall}`} onClick={() => this.playAtIndex(0)}>
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
                className={song.id === activeSong ? `${table.active_song}` : ''}
              >
                <td>{song.meta.name || song.filename}</td>
                <td>{song.duration ? humanizeDuration(song.duration) : ''}</td>
                <td>{song.meta.artists_original || 'Unknown'}</td>
                <td>{song.meta.album || 'Unknown'}</td>
                <td>{song.meta.genre || 'Unknown'} </td>
                {song.id === activeSong && songState === 'playing' ? (
                  <td className={`${table.playingSongIcon} ${flex.align_center}`}>
                    <i className={`${button.btn_blue} material-icons`}>volume_up</i>
                  </td>
                ) : (
                  <td className={`${table.song_wrapper_btns} ${flex.space_between}`}>
                    <button
                      type="button"
                      onClick={() => this.playAtIndex(index)}
                      className={`${button.btn} ${button.btn_blue}`}
                    >
                      <i className="material-icons">play_arrow</i>
                    </button>
                    <SongDropdown song={song} playlist={playlist} />
                  </td>
                )}
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
    songState: songs.songState,
    activeSong: songs.playlist[songs.songIndex] || null,
  }),
  { setSongPlaylist },
)(SongsTable)
