// @flow

import * as React from 'react'
import groupBy from 'lodash/groupBy'

import '~/css/content-card.css'

import Dropdown from './Dropdown'
import AlbumInfo from './AlbumInfo'

type Props = {|
  songs: Array<Object>,
  selected: ?Object,
|}
type State = {||}

export default class ContentCard extends React.Component<Props, State> {
  render() {
    const { songs, selected } = this.props

    let songsToShow = songs
    if (selected) {
      if (selected.type === 'artist') {
        songsToShow = songs.filter(item => item.meta && item.meta.artists.includes(selected.identifier))
      } else if (selected.type === 'genre') {
        songsToShow = songs.filter(item => item.meta && item.meta.genre && item.meta.genre.includes(selected.identifier))
      }
    }
    const songsByAlbums = groupBy(songsToShow, 'meta.album')

    let songsIdsArr = []
    songsToShow.forEach(song => {
      songsIdsArr.push(song.id)
    })

    return (
      <div className="section-artist" id={selected ? selected.identifier : 'allArtists'}>
        <div className="space-between section-artist-header">
          <div>
            <h2>{selected ? selected.identifier : 'All Artists'}</h2>
            <p>
              {Object.keys(songsByAlbums).length} albums, {songsToShow.length} songs
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
