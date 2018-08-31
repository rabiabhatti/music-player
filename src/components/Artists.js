// @flow

import * as React from 'react'
import { connect } from 'react-redux'

import db from '~/db'
import { getArtistsFromSongs } from '~/common/songs'
import type { File } from '~/types'

import '~/css/artists.css'
import ContentCard from './ContentCard'

type Props = {|
  nonce: number,
|}
type State = {|
  songs: Array<File>,
  selected: {|
    type: string,
    identifier: string,
  |},
  songsByArtist: Array<File>,
|}

const DEFAULT_SELETED = {
  type: 'artist',
  identifier: 'all',
}

class Artists extends React.Component<Props, State> {
  state = {
    songs: [],
    selected: DEFAULT_SELETED,
    songsByArtist: [],
  }

  componentDidMount() {
    this.fetchSongs()
  }

  componentWillReceiveProps(newProps) {
    if (newProps.nonce !== this.props.nonce) {
      this.fetchSongs()
    }
  }

  fetchSongs = async () => {
    const dbSongs = await db.songs.toArray()
    this.setState({ songs: dbSongs })
  }

  render() {
    const { songs, selected, songsByArtist } = this.state
    const artists = getArtistsFromSongs(songs)

    return (
      <React.Fragment>
        {songs.length ? (
          <div className="section-artists bound">
            <div className="artists-bar">
              <button
                className={`align-center btn-dull artists-bar-row ${
                  selected && selected.type === 'artist' && selected.identifier === 'all' ? 'active' : ''
                }`}
                onClick={() => this.setState({ selected: { type: 'artist', identifier: 'all' } })}
              >
                <i className="material-icons artists-bar-row-icon">mic</i>
                <span>All Artists</span>
              </button>
              {Object.keys(artists).map(artist => {
                const artistsSongs = artists[artist]
                return (
                  <button
                    key={artist}
                    className={`align-center btn-dull artists-bar-row ${
                      selected && selected.type === 'artist' && selected.identifier === artist ? 'active' : ''
                    }`}
                    onClick={() =>
                      this.setState({
                        selected: { type: 'artist', identifier: artist },
                        songsByArtist: artistsSongs,
                      })
                    }
                  >
                    <span>{artist}</span>
                  </button>
                )
              })}
            </div>
            <ContentCard songs={songsByArtist} selected={selected} />
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

export default connect(
  ({ songs }) => ({ nonce: songs.nonce }),
  null,
)(Artists)
