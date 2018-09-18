// @flow

import React from 'react'
import connect from '~/common/connect'

import { setSongPlaylist } from '~/redux/songs'
import { humanizeDuration } from '~/common/songs'

import '~/styles/album-info.less'
import cover from '~/static/img/alter-img.png'

import Dropdown from './utilities/Dropdown'

type Props = {|
  name: string,
  songs: Array<Object>,
  setSongPlaylist: typeof setSongPlaylist,
|}
type State = {||}

class AlbumInfo extends React.Component<Props, State> {
  playAtIndex = (index: number) => {
    this.props.setSongPlaylist({
      songs: this.props.songs.map(song => song.id),
      index,
    })
  }

  render() {
    const { songs, name } = this.props

    const totalDuration = songs.reduce((agg, curr) => agg + curr.duration, 0)

    const songsIds = songs.map(s => s.id)

    return (
      <div className="section-album-info space-between flex-wrap">
        <div className="album-title flex-column">
          <div className="album-cover">
            <img
              alt="album-cover"
              src={
                songs[0].artwork && songs[0].artwork.album && songs[0].artwork.album.uri ? songs[0].artwork.album.uri : cover
              }
            />
            <button className="align-center" onClick={() => this.playAtIndex(0)}>
              <i className="material-icons album-play-btn">play_circle_outline</i>
            </button>
          </div>
          <div className="space-between">
            <p>
              {songs.length} songs, {!totalDuration ? '' : humanizeDuration(totalDuration)} minutes
            </p>
            <button className="btn-blue" onClick={() => this.playAtIndex(0)}>
              Shuffle
            </button>
          </div>
        </div>
        <div className="album-info-content">
          <div className="space-between">
            <div>
              <h2>{name === 'undefined' ? 'Unkown' : name}</h2>
              <button className="btn-blue">{songs[0].meta && songs[0].meta.album_artists.join(', ')}</button>
              <p>
                {songs[0].meta && songs[0].meta.genre ? songs[0].meta.genre : 'Unkown'} &bull;{' '}
                {songs[0].meta && songs[0].meta.year ? songs[0].meta.year : 'Unkown'}
              </p>
            </div>
            <Dropdown songsIds={songsIds} album={name} />
          </div>
          <div className="flex-column">
            {songs.map((song, index) => (
              <div
                className="space-between align-center flex-wrap"
                key={song.sourceId}
                onDoubleClick={() => this.playAtIndex(index)}
              >
                <p>{index + 1}</p>
                <p>
                  {song.meta && typeof song.meta.name !== 'undefined' ? song.meta.name : song.filename.replace('.mp3', '')}
                </p>
                <p>{!song.duration ? '' : humanizeDuration(song.duration)}</p>
                <div className="song-btns space-between">
                  <button onClick={() => this.playAtIndex(index)}>
                    <i className="material-icons song-play-btn btn-blue">play_arrow</i>
                  </button>
                  <Dropdown songsIds={[song.id]} song={song} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
}

export default connect(null, { setSongPlaylist })(AlbumInfo)
