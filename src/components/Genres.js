// @flow

import * as React from 'react'

import db from '~/db'
import type { File } from '~/types'
import { getGenresFromSongs } from '~/common/songs'

import '~/css/artists.css'
import ContentCard from './ContentCard'

type Props = {||}
type State = {|
  songs: Array<File>,
  selected: {|
    type: string,
    identifier: string,
  |},
  genresSongs: Array<File>,
|}

const DEFAULT_SELETED = {
  type: 'genre',
  identifier: 'all',
}

export default class Genres extends React.Component<Props, State> {
  state = {
    songs: [],
    selected: DEFAULT_SELETED,
    genresSongs: [],
  }

  componentDidMount() {
    this.fetchSongs()
  }

  fetchSongs = async () => {
    const dbSongs = await db.songs.toArray()
    this.setState({ songs: dbSongs })
  }

  render() {
    const { songs, selected, genresSongs } = this.state
    const genres = getGenresFromSongs(songs)

    return (
      <React.Fragment>
        {songs.length ? (
          <div className="section-artists bound">
            <div className="artists-bar">
              <button
                className={`align-center btn-dull artists-bar-row ${
                  selected && selected.type === 'genre' && selected.identifier === 'all' ? 'active' : ''
                }`}
                onClick={() => this.setState({ selected: { type: 'genre', identifier: 'all' } })}
              >
                <i className="material-icons artists-bar-row-icon">queue_music</i>
                <span>All Genres</span>
              </button>

              {Object.keys(genres).map(genre => {
                const SongsByGenre = genres[genre]
                return (
                  <button
                    key={genre}
                    className={`align-center btn-dull artists-bar-row ${
                      selected && selected.type === 'artist' && selected.identifier === genre ? 'active' : ''
                    }`}
                    onClick={() =>
                      this.setState({
                        selected: { type: 'artist', identifier: genre },
                        genresSongs: SongsByGenre,
                      })
                    }
                  >
                    <i className="material-icons artists-bar-row-icon">queue_music</i>
                    <span>{genre}</span>
                  </button>
                )
              })}
            </div>
            <ContentCard songs={genresSongs} selected={selected} />
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
