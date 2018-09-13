// @flow

import * as React from 'react'
import groupBy from 'lodash/groupBy'
import flatten from 'lodash/flatten'
import connect from '~/common/connect'

import db from '~/db'
import '~/css/content-card.css'
import { getArtistsFromSongs, getGenresFromSongs } from '~/common/songs'

import Dropdown from './utilities/Dropdown'
import AlbumInfo from './AlbumInfo'

type Props = {|
  nonce: number,
  selected: ?Object,
|}

type State = {|
  songsByAlbums: Object,
|}

class ContentCard extends React.Component<Props, State> {
  state = {
    songsByAlbums: {},
  }

  componentDidMount() {
    this.fetchSongs(this.props.selected)
  }

  componentDidUpdate(prevProps) {
    if (prevProps.nonce !== this.props.nonce || prevProps.selected !== this.props.selected) {
      this.fetchSongs(this.props.selected)
    }
  }

  fetchSongs = async (selected: ?Object) => {
    const songs = await db.songs.toArray()
    const artists = getArtistsFromSongs(songs)
    const genres = getGenresFromSongs(songs)

    if (!selected) {
      this.setState({
        songsByAlbums: groupBy(songs, 'meta.album'),
      })
    } else if (selected && selected.type === 'artist') {
      this.setState({
        songsByAlbums: groupBy(artists[selected.identifier], 'meta.album'),
      })
    } else if (selected && selected.type === 'genre') {
      this.setState({
        songsByAlbums: groupBy(genres[selected.identifier], 'meta.album'),
      })
    }
  }

  render() {
    const { selected } = this.props
    const { songsByAlbums } = this.state

    const songs = flatten(Object.values(songsByAlbums))

    const songsIds = songs.map(s => s.id)

    return (
      <div className="section-artist">
        <div className="space-between section-artist-header">
          <div>
            <h2>{!selected ? `All` : selected.identifier}</h2>
            <p>
              {Object.keys(songsByAlbums).length} albums, {songs.length} songs
            </p>
          </div>
          <Dropdown songsIds={songsIds} />
        </div>
        {Object.keys(songsByAlbums).map(albumName => (
          <AlbumInfo name={albumName} key={albumName} songs={songsByAlbums[albumName]} />
        ))}
      </div>
    )
  }
}

export default connect(
  ({ songs }) => ({ nonce: songs.nonce }),
  null,
)(ContentCard)
