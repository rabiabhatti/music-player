// @flow

import * as React from 'react'
import { connect } from 'react-redux'

import db from '~/db'
import { setSelected, type SongsStateSelected } from '~/redux/songs'
import { getArtistsFromSongs } from '~/common/songs'
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

class Artists extends React.Component<Props, State> {
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
    const artists = getArtistsFromSongs(songs)

    return (
      <div className="section-artists bound">
        <div className="artists-bar">
          <a
            className={`align-center artists-bar-row ${selected && selected.type === 'artist' ? '' : 'active'}`}
            href="#allArtists"
            onClick={() => this.props.setSelected(null)}
          >
            <i className="material-icons artists-bar-row-icon">mic</i>
            <span>All Artists</span>
          </a>
          {artists.map(artist => (
            <a
              className={`align-center artists-bar-row ${
                selected && selected.type === 'artist' && selected.identifier === artist ? 'active' : ''
              }`}
              key={artist}
              href={`#${artist}`}
              style={{ cursor: 'pointer' }}
              onClick={() => this.props.setSelected({ type: 'artist', identifier: artist })}
            >
              <i className="material-icons artists-bar-row-icon">person</i>
              <span>{artist}</span>
            </a>
          ))}
        </div>
        <div className="section-artists-info">
          <ContentCard songs={songs} selected={selected && selected.type === 'artist' ? selected : null} />
        </div>
      </div>
    )
  }
}

export default connect(({ songs }) => ({ selected: songs.selected }), { setSelected })(Artists)
