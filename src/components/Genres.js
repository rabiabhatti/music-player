// @flow

import * as React from 'react'
import { connect } from 'react-redux'

import db from '~/db'
import { setSelected, type SongsStateSelected } from '~/redux/songs'
import { getGenresFromSongs } from '~/common/songs'
import type { File } from '~/services/types'

import ContentCard from './ContentCard'
import AlbumInfo from './AlbumInfo'

import cover from '../static/img/album-cover.jpg'
import cover3 from '../static/img/album-cover-3.png'
import cover4 from '../static/img/album-cover-4.jpg'

type Props = {|
  selected: SongsStateSelected,
  setSelected: typeof setSelected,
|}
type State = {|
  songs: Array<File>,
|}

class Genres extends React.Component<Props, State> {
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
    const genres = getGenresFromSongs(songs)

    return (
      <div className="section-artists bound">
        <div className="artists-bar">
          {genres.map(genre => (
            <a
              className={`align-center artists-bar-row ${
                selected && selected.type === 'genre' && selected.identifier === genre ? 'active' : ''
              }`}
              href={`#${genre}`}
              key={genre}
              style={{ cursor: 'pointer' }}
              onClick={() => this.props.setSelected({ type: 'genre', identifier: genre })}
            >
              <i className="material-icons artists-bar-row-icon">queue_music</i>
              <span>{genre}</span>
            </a>
          ))}
        </div>
        <div className="section-artists-info">
          <ContentCard songs={songs} selected={selected && selected.type === 'genre' ? selected : null} />
        </div>
      </div>
    )
  }
}

export default connect(({ songs }) => ({ selected: songs.selected }), { setSelected })(Genres)
