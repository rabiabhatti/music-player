// @flow

import React from 'react'
import connect from '~/common/connect'

import { setSongPlaylist } from '~/redux/songs'
import { humanizeDuration } from '~/common/songs'

import flex from '~/less/flex.less'
import button from '~/less/button.less'
import albumInfo from '~/less/album-info.less'

import cover from '~/static/img/alter-img.png'

import SongDropdown from '~/components/Dropdown/SongDropdown'
import AlbumDropdown from '~/components/Dropdown/AlbumDropdown'

type Props = {|
  name: string,
  songState: string,
  songs: Array<Object>,
  activeSong: number | null,
  setSongPlaylist: typeof setSongPlaylist,
|}
type State = {||}

class AlbumInfo extends React.Component<Props, State> {
  playAtIndex = (index: number, ids: Array<number>) => {
    const { setSongPlaylist: setSongPlaylistProp } = this.props
    setSongPlaylistProp({
      songs: ids,
      index,
    })
  }

  render() {
    const { songs, name, activeSong, songState } = this.props

    const totalDuration = songs.reduce((agg, curr) => agg + curr.duration, 0)

    const songsIds = songs.map(s => s.id)

    return (
      <div className={`${albumInfo.album_info} ${flex.wrap} ${flex.space_between}`}>
        <div className={`${flex.column} ${albumInfo.album_title}`}>
          <div className={`${albumInfo.album_cover}`}>
            <div className={`${albumInfo.filter}`} />
            <img
              alt="album-cover"
              src={
                songs[0].artwork && songs[0].artwork.album && songs[0].artwork.album.uri ? songs[0].artwork.album.uri : cover
              }
            />
            <button
              type="button"
              className={`${button.btn} ${flex.align_center}`}
              onClick={() => this.playAtIndex(0, songsIds)}
            >
              <i className={`${albumInfo.album_play_btn} material-icons`}>play_circle_outline</i>
            </button>
          </div>
          <div className={`${flex.space_between}`}>
            <p>
              {songs.length} songs, {totalDuration ? humanizeDuration(totalDuration) : ''} minutes
            </p>
            <button
              type="button"
              className={`${button.btn} ${button.btn_blue}`}
              onClick={() => this.playAtIndex(0, songsIds)}
            >
              Shuffle
            </button>
          </div>
        </div>
        <div className={`${albumInfo.album_info_content}`}>
          <div className={`${flex.space_between}`}>
            <div>
              <h2>{name === 'undefined' ? 'Unkown' : name}</h2>
              <button type="button" className={`${button.btn} ${button.btn_blue} ${albumInfo.artistLink}`}>
                {songs[0].meta && songs[0].meta.album_artists.join(', ')}
              </button>
              <p>
                {songs[0].meta && songs[0].meta.genre ? songs[0].meta.genre : 'Unkown'} &bull;{' '}
                {songs[0].meta && songs[0].meta.year ? songs[0].meta.year : 'Unkown'}
              </p>
            </div>
            <AlbumDropdown songsIds={songsIds} />
          </div>
          <div className={`${flex.column}`}>
            {songs.map((song, index) => (
              <div
                key={song.sourceId}
                onDoubleClick={() => this.playAtIndex(index, songsIds)}
                className={`${flex.space_between} ${flex.align_center} ${flex.wrap} ${song.id === activeSong ? `${albumInfo.active_song}` : ''}`}
              >
                {song.id === activeSong && songState === 'playing' ? (
                  <div className={`${flex.space_between} ${albumInfo.activeSong_row} ${flex.align_center}`}>
                    <i className={`${button.btn_blue} material-icons`}>volume_up</i>
                    <p className={`${albumInfo.song_title}`}>
                      {song.meta && typeof song.meta.name !== 'undefined'
                        ? song.meta.name
                        : song.filename.replace('.mp3', '')}
                    </p>
                    <p>{humanizeDuration(song.duration)}</p>
                  </div>
                ) : (
                  <React.Fragment>
                    <p>{index + 1}</p>
                    <p className={`${albumInfo.song_title}`}>
                      {song.meta && typeof song.meta.name !== 'undefined'
                        ? song.meta.name
                        : song.filename.replace('.mp3', '')}
                    </p>
                    <p>{song.duration ? humanizeDuration(song.duration) : ''}</p>
                    <div className={`${flex.space_between} ${albumInfo.song_btns}`}>
                      <button
                        type="button"
                        className={`${button.btn} ${button.btn_blue}`}
                        onClick={() => this.playAtIndex(index, songsIds)}
                      >
                        <i className="material-icons">play_arrow</i>
                      </button>
                      <SongDropdown song={song} />
                    </div>
                  </React.Fragment>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
}

export default connect(
  ({ songs }) => ({
    activeSong: songs.playlist[songs.songIndex] || null,
    songState: songs.songState,
  }),
  { setSongPlaylist },
)(AlbumInfo)
