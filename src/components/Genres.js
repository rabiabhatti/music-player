// @flow

import * as React from 'react'
import { connect } from 'react-redux'

import db from '~/db'
import { getGenresFromSongs } from '~/common/songs'
import type { File } from '~/types'

import ContentCard from './ContentCard'
import AlbumInfo from './AlbumInfo'

import cover from '../static/img/album-cover.jpg'
import cover3 from '../static/img/album-cover-3.png'
import cover4 from '../static/img/album-cover-4.jpg'

type Props = {||}
type State = {|
  songs: Array<File>,
  selected: ?{|
    type: string,
    identifier: string,
  |},
|}

export default class Genres extends React.Component<Props, State> {
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
    const genres = getGenresFromSongs(songs)

    return (
      <React.Fragment>
        {this.state.songs.length ? (
          <div className="section-artists bound">
            <div className="artists-bar">
              {genres.map(
                genre =>
                  genre !== 'Unknown' && (
                    <a
                      className={`align-center artists-bar-row ${
                        selected && selected.type === 'genre' && selected.identifier === genre ? 'active' : ''
                      }`}
                      href={`#${genre}`}
                      key={genre}
                      style={{ cursor: 'pointer' }}
                      onClick={() => this.setState({ selected: { type: 'genre', identifier: genre } })}
                    >
                      <i className="material-icons artists-bar-row-icon">queue_music</i>
                      <span>{genre}</span>
                    </a>
                  ),
              )}
            </div>
            <div className="section-artists-info">
              <ContentCard songs={songs} selected={selected && selected.type === 'genre' ? selected : null} />
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
