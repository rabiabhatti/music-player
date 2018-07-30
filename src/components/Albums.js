// @flow

import * as React from 'react'
import groupBy from 'lodash/groupBy'
import { connect } from 'react-redux'

import db from '~/db'
import { setSelected, type SongsStateSelected } from '~/redux/songs'
import { getAlbumsFromSongs } from '~/common/songs'
import type { File } from '~/services/types'

import AlbumInfo from './AlbumInfo'

import cover from '../static/img/album-cover.jpg'
import cover2 from '../static/img/album-cover-2.jpg'
import cover3 from '../static/img/album-cover-3.png'
import cover4 from '../static/img/album-cover-4.jpg'

type Props = {|
  selected: SongsStateSelected,
  setSelected: typeof setSelected,
|}
type State = {|
  songs: Array<File>,
|}

class Albums extends React.Component<Props, State> {
  state = {
    songs: [],
  }

  async componentDidMount() {
    const dbSongs = await db.songs.toArray()
    this.setState({ songs: dbSongs })
  }
  render() {
    const { songs } = this.state
    const { selected } = this.props
    const albums = getAlbumsFromSongs(songs)

    let songsToShow = songs
    if (selected) {
      if (selected.type === 'album') {
        songsToShow = songs.filter(item => item.meta && item.meta.album && item.meta.album.includes(selected.identifier))
      }
    }

    return (
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
                  onClick={() => this.props.setSelected({ type: 'album', identifier: album })}
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
    )
  }
}

export default connect(({ songs }) => ({ selected: songs.selected }), { setSelected })(Albums)
