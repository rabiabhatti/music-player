// @flow

import React from 'react'
import connect from '~/common/connect'

import { humanizeDuration } from '~/common/songs'
import { setSongPlaylist, songPlay, songPause } from '~/redux/songs'

import flex from '~/less/flex.less'
import button from '~/less/button.less'
import albumInfo from '~/less/album-info.less'

import cover from '~/static/img/alter-img.png'

import SongDropdown from '~/components/Dropdown/SongDropdown'
import AlbumDropdown from '~/components/Dropdown/AlbumDropdown'

type Props = {|
  name: string,
  songState: string,
  dispatch: Function,
  songs: Array<Object>,
  activeSong: number | null,
|}
type State = {||}

class AlbumInfo extends React.Component<Props, State> {
  playAtIndex = (index: number, ids: Array<number>) => {
    const { dispatch } = this.props
    dispatch(
      setSongPlaylist({
        songs: ids,
        index,
      }),
    )
  }

  playPause = () => {
    const { songState, dispatch } = this.props
    dispatch(songState === 'playing' ? songPause() : songPlay())
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
                {songs[0].meta && songs[0].meta.artists_original}
              </button>
              <p>
                {songs[0].meta && songs[0].meta.genre ? songs[0].meta.genre : 'Unkown'} &bull;{' '}
                {songs[0].meta && songs[0].meta.year ? songs[0].meta.year : 'Unkown'}
              </p>
            </div>
            <AlbumDropdown songsIds={songsIds} />
          </div>
          <div className={`${flex.column} ${albumInfo.songs_container}`}>
            {songs.map((song, index) => (
              <div
                key={song.sourceId}
                onDoubleClick={() => this.playAtIndex(index, songsIds)}
                className={`${flex.space_between} ${flex.align_center} ${flex.wrap} ${albumInfo.song_row} ${
                  song.id === activeSong ? `${albumInfo.active_song}` : ''
                }`}
              >
                <p>{index + 1}</p>

                <p className={`${albumInfo.song_title}`}>
                  {song.meta && typeof song.meta.name !== 'undefined' ? song.meta.name : song.filename.replace('.mp3', '')}
                </p>
                <p>{song.duration ? humanizeDuration(song.duration) : ''}</p>
                {song.id === activeSong ? (
                  <div className={`${flex.space_between} ${albumInfo.active_song_btns}`}>
                    <button type="button" className={`${button.btn} ${button.btn_blue}`} onClick={() => this.playPause()}>
                      <i
                        title={songState === 'playing' ? 'Pause' : 'Play'}
                        className={`${albumInfo.active_song_icon} material-icons`}
                      >
                        {songState === 'playing' ? 'pause' : 'play_arrow'}
                      </i>
                    </button>
                    <SongDropdown song={song} />
                  </div>
                ) : (
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
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
}

export default connect(({ songs }) => ({
  activeSong: songs.playlist[songs.songIndex] || null,
  songState: songs.songState,
}))(AlbumInfo)
