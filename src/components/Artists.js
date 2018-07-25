// @flow

import * as React from 'react'
import groupBy from 'lodash/groupBy'

import db from '~/db'

import ArtistGenre from './ArtistGenre'
import AlbumInfo from './AlbumInfo'

import cover from '../static/img/album-cover.jpg'
import cover3 from '../static/img/album-cover-3.png'
import cover4 from '../static/img/album-cover-4.jpg'

type Props = {||}
type State = {|
  songs: Array<Object>,
|}

export default class Artists extends React.Component<Props, State> {
  state = { songs: [] }
  async componentDidMount() {
    const dbSongs = await db.songs.toArray()
    this.setState({ songs: dbSongs })
  }

  render() {
    const groupedSongs = groupBy(this.state.songs, function(song) {
      return song.artwork.artist ? song.artwork.artist.trim() : 'Unknown'
    })

    return (
      <div className="section-artists bound">
        <div className="artists-bar">
          <a className="align-center artists-bar-row active" href="#allArtists">
            <i className="material-icons artists-bar-row-icon">mic</i>
            <span>All Artists</span>
          </a>
          {Object.keys(groupedSongs)
            .sort()
            .map(artistName => (
              <a className="align-center artists-bar-row" href={`#${artistName}`} key={artistName}>
                <i className="material-icons artists-bar-row-icon">person</i>
                <span>{artistName}</span>
              </a>
            ))}
        </div>
        <div className="section-artists-info">
          <ArtistGenre id="allArtists" name="All Artists" albumsCount={3} songsCount={25}>
            <AlbumInfo cover={cover} name="Everyday Is Christmas" artist="Sia Furler" genre="Holiday" />
            <AlbumInfo cover={cover4} name="1989" artist="Taylor Swift" genre="Holiday" />
            <AlbumInfo cover={cover3} name="Mind of Mine" artist="Zain Malik" genre="Holiday" />
          </ArtistGenre>
          {Object.keys(groupedSongs)
            .sort()
            .map(artistName => (
              <ArtistGenre href={`#${artistName}`} name={artistName} albumsCount={1} songsCount={7} key={artistName}>
                <AlbumInfo cover={cover} name="Everyday Is Christmas" artist={artistName} genre="Holiday" />
              </ArtistGenre>
            ))}
        </div>
      </div>
    )
  }
}
