// @flow

import * as React from 'react'
import groupBy from 'lodash/groupBy'

import '~/css/content-card.css'

import Dropdown from './Dropdown'
import AlbumInfo from './AlbumInfo'

type Props = {|
  songs: Array<Object>,
  selected: Object,
|}
type State = {|
  hidden: boolean,
|}

export default class ContentCard extends React.Component<Props, State> {
  state = {
    hidden: true,
  }

  render() {
    const { hidden } = this.state
    const { songs, selected } = this.props
    const songsByAlbums = groupBy(songs, 'meta.album')

    const songsIdsArr = []
    songs.forEach(song => {
      songsIdsArr.push(song.id)
    })

    return (
      <div className={`section-artist ${selected ? 'show' : 'hidden'}`}>
        <div className="space-between section-artist-header">
          <div>
            <h2>{selected.identifier === 'all' ? `All ${selected.type}s` : selected.identifier}</h2>
            <p>
              {Object.keys(songsByAlbums).length} albums, {songs.length} songs
            </p>
          </div>
          <Dropdown songsIds={songsIdsArr} />
        </div>
        {Object.keys(songsByAlbums).map(albumName => (
          <AlbumInfo name={albumName} key={albumName} songs={songsByAlbums[albumName]} />
        ))}
      </div>
    )
  }
}
