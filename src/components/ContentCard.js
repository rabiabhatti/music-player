// @flow

import * as React from 'react'
import groupBy from 'lodash/groupBy'
import flatten from 'lodash/flatten'
import connect from '~/common/connect'

import db from '~/db'
import { getArtistsFromSongs, getGenresFromSongs } from '~/common/songs'
import ContentCardDropdown from '~/components/Dropdown/ContentCardDropdown'

import flex from '~/less/flex.less'
import contentCard from '~/less/content-card.less'

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
    const { selected } = this.props
    this.fetchSongs(selected)
  }

  componentDidUpdate(prevProps) {
    const { nonce, selected } = this.props
    if (prevProps.nonce !== nonce || prevProps.selected !== selected) this.fetchSongs(selected)
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
      <div className={`${contentCard.content_card}`}>
        <div className={`${flex.space_between} ${contentCard.heading} ${flex.align_baseline}`}>
          <div>
            <h2>{!selected ? `All` : selected.identifier}</h2>
            <p>
              {Object.keys(songsByAlbums).length} albums, {songs.length} songs
            </p>
          </div>
          <ContentCardDropdown songsIds={songsIds} />
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
