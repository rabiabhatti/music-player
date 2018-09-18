// @flow

import * as React from 'react'
import connect from '~/common/connect'

import db from '~/db'
import type { File } from '~/types'
import { getGenresFromSongs } from '~/common/songs'

import '~/styles/artists.less'
import ContentCard from './ContentCard'
import ReplacementText from './utilities/ReplacementText'

type Props = {|
  nonce: number,
|}
type State = {|
  songs: Array<File>,
  selected: ?{|
    type: string,
    identifier: string,
  |},
|}

class Genres extends React.Component<Props, State> {
  state = {
    songs: [],
    selected: null,
  }

  componentDidMount() {
    this.fetchSongs()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.nonce !== this.props.nonce) {
      this.fetchSongs()
    }
  }

  fetchSongs = async () => {
    const songs = await db.songs.toArray()
    this.setState({ songs })
  }

  render() {
    const { songs, selected } = this.state
    const genres = getGenresFromSongs(songs)

    return songs.length ? (
      <div className="flex-row bound">
        <div className="artists-bar">
          <button
            className={`align-center btn-dull ${!selected ? 'active' : ''}`}
            onClick={() => this.setState({ selected: null })}
          >
            <i className="material-icons">queue_music</i>
            All Genres
          </button>

          {Object.keys(genres).map(genre => (
            <button
              key={genre}
              className={`align-center btn-dull ${
                selected && selected.type === 'genre' && selected.identifier === genre ? 'active' : ''
              }`}
              onClick={() =>
                this.setState({
                  selected: { type: 'genre', identifier: genre },
                })
              }
            >
              {genre}
            </button>
          ))}
        </div>
        <ContentCard selected={selected} />
      </div>
    ) : (
      <ReplacementText />
    )
  }
}

export default connect(({ songs }) => ({ nonce: songs.nonce }), null)(Genres)
