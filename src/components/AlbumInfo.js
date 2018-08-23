// @flow

import React from 'react'
import { connect } from 'react-redux'

import db from '~/db'
import { setSongPlaylist } from '~/redux/songs'
import { humanizeDuration } from '~/common/songs'

import '~/css/album-info.css'

import Dropdown from './Dropdown'

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
    let i = 1

    const totalDuration = songs.reduce((agg, curr) => agg + curr.duration, 0)

    let songsIdsArr = []
    songs.forEach(song => {
      songsIdsArr.push(song.id)
    })

    return (
      <div id="album-info">
        <div className="section-album-info space-between flex-wrap">
          <div className="album-title flex-column">
            <div className="album-cover">
              <div className="album-cover-filter" />
              <img alt="album-cover" className="album-cover-img" src={null} />
              <button className="album-cover-icon align-center">
                <i className="material-icons album-play-btn">play_circle_outline</i>
              </button>
            </div>
            <div className="space-between">
              <p>
                {songs.length} songs, {humanizeDuration(totalDuration)} minutes
              </p>
              <button className="btn-blue" onClick={() => this.playAtIndex(0)}>
                Shuffle
              </button>
            </div>
          </div>
          <div className="album-info-content">
            <div className="space-between section-album-info-header">
              <div>
                <h2>{name === 'undefined' ? 'Unkown' : name}</h2>
                <button className="album-info-artist btn-blue">
                  {songs[0].meta && songs[0].meta.album_artists.join(', ')}
                </button>
                <p>
                  {songs[0].meta && songs[0].meta.genre ? songs[0].meta.genre : 'Unkown'} &bull;{' '}
                  {songs[0].meta && songs[0].meta.year ? songs[0].meta.year : 'Unkown'}
                </p>
              </div>
              <Dropdown songsIds={songsIdsArr} />
            </div>
            <div className="section-album-songs-table flex-column">
              {songs.map((song, index) => (
                <div className="song-info space-between align-center flex-wrap" key={song.sourceId}>
                  <p>{i++}</p>
                  <p>
                    {song.meta && typeof song.meta.name !== 'undefined' ? song.meta.name : song.filename.replace('.mp3', '')}
                  </p>
                  <p>{humanizeDuration(song.duration)}</p>
                  <div className="song-btns space-between">
                    <button onClick={() => this.playAtIndex(index)}>
                      <i className="material-icons song-play-btn btn-blue">play_arrow</i>
                    </button>
                    <Dropdown songsIds={song.id} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(
  null,
  { setSongPlaylist },
)(AlbumInfo)
