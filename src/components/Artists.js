// @flow

import * as React from 'react'

import db from '~/db'
import { getArtistsFromSongs } from '~/common/songs'
import type { File } from '~/types'

import '~/css/artists.css'
import ContentCard from './ContentCard'

type Props = {||}
type State = {|
  songs: Array<File>,
  selected: ?{|
    type: string,
    identifier: string,
  |},
|}

export default class Artists extends React.Component<Props, State> {
  state = {
    songs: [],
    selected: null,
  }

  componentDidMount() {
    this.fetchSongs()
  }

  fetchSongs = async () => {
    const dbSongs = await db.songs.toArray()
    this.setState({ songs: dbSongs })
  }

  render() {
    const { songs, selected } = this.state
    const artists = getArtistsFromSongs(songs)

    return (
      <React.Fragment>
        {this.state.songs.length ? (
          <div className="section-artists bound">
            <div className="artists-bar">
              <a
                className={`align-center artists-bar-row ${selected && selected.type === 'artist' ? '' : 'active'}`}
                href="#allArtists"
                onClick={() => this.setState({ selected: null })}
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
                  onClick={() =>
                    this.setState({
                      selected: { type: 'artist', identifier: artist },
                    })
                  }
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
        ) : (
          <div className="align-center justify-center bound" style={{ height: 300 }}>
            <h2 className="replacement-text">Add Music</h2>
          </div>
        )}
      </React.Fragment>
    )
  }
}
