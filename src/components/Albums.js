// @flow

import * as React from 'react'
import groupBy from 'lodash/groupBy'

import db from '~/db'
import { getAlbumsFromSongs } from '~/common/songs'
import type { File } from '~/types'

import AlbumInfo from './AlbumInfo'

import cover from '../static/img/album-cover.jpg'

type Props = {||}
type State = {|
  songs: Array<File>,
  selected: ?{|
    type: string,
    identifier: string,
  |},
|}

export default class Albums extends React.Component<Props, State> {
  state = {
    songs: [],
    selected: null,
  }

  async componentDidMount() {
    const dbSongs = await db.songs.toArray()
    this.setState({ songs: dbSongs })
  }
  render() {
    const { songs, selected } = this.state
    const albums = getAlbumsFromSongs(songs)

    let songsToShow = songs
    if (selected) {
      if (selected.type === 'album') {
        songsToShow = songs.filter(item => item.meta && item.meta.album && item.meta.album.includes(selected.identifier))
      }
    }

    return (
      <React.Fragment>
        {this.state.songs.length ? (
          <div className="section-albums bound">
            <div className="section-albums-container">
              {albums.map(album => (
                <React.Fragment key={album}>
                  <div className="album-content">
                    <div className="album-cover">
                      <div className="album-cover-filter" />
                      <img alt="album-cover" className="album-cover-img" src={cover} />
                      <button className="album-cover-icon">
                        <i className="material-icons">play_circle_outline</i>
                      </button>
                    </div>
                    <div
                      className="album-infomation"
                      style={{ cursor: 'pointer' }}
                      onClick={() => this.setState({ selected: { type: 'album', identifier: album } })}
                    >
                      <h4 className="album-name">{album}</h4>
                      <p className="album-artist">Sia Furler</p>
                    </div>
                  </div>
                  {selected && selected.type === 'album' && selected.identifier === album ? (
                    <AlbumInfo name={album} songs={songsToShow} />
                  ) : null}
                </React.Fragment>
              ))}
            </div>
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
