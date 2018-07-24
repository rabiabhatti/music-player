// @flow

import * as React from 'react'

import ArtistGenre from './ArtistGenre'
import AlbumInfo from './AlbumInfo'

import cover from '../static/img/album-cover.jpg'
import cover3 from '../static/img/album-cover-3.png'
import cover4 from '../static/img/album-cover-4.jpg'

type Props = {||}
type State = {||}

export default class Artists extends React.Component<Props, State> {
  render() {
    return (
      <div className="section-artists bound">
        <div className="artists-bar">
          <a className="align-center artists-bar-row active" href="#allArtists">
            <i className="material-icons artists-bar-row-icon">mic</i>
            <span>All Artists</span>
          </a>
          <a className="align-center artists-bar-row" href="#artist1">
            <i className="material-icons artists-bar-row-icon">person</i>
            <span>Sia Furler</span>
          </a>
          <a className="align-center artists-bar-row" href="#artist2">
            <i className="material-icons artists-bar-row-icon">person</i>
            <span>Taylor Swift</span>
          </a>
          <a className="align-center artists-bar-row" href="#artist3">
            <i className="material-icons artists-bar-row-icon">person</i>
            <span>Zayn Malik</span>
          </a>
        </div>
        <div className="section-artists-info">
          <ArtistGenre id="allArtists" name="All Artists" albumsCount={3} songsCount={25}>
            <AlbumInfo cover={cover} name="Everyday Is Christmas" artist="Sia Furler" genre="Holiday" />
            <AlbumInfo cover={cover4} name="1989" artist="Taylor Swift" genre="Holiday" />
            <AlbumInfo cover={cover3} name="Mind of Mine" artist="Zain Malik" genre="Holiday" />
          </ArtistGenre>
          <ArtistGenre id="artist1" name="Sia Furler" albumsCount={1} songsCount={7}>
            <AlbumInfo cover={cover} name="Everyday Is Christmas" artist="Sia Furler" genre="Holiday" />
          </ArtistGenre>
          <ArtistGenre id="artist2" name="Taylor Swift" albumsCount={1} songsCount={7}>
            <AlbumInfo cover={cover4} name="1989" artist="Taylor Swift" genre="Holiday" />
          </ArtistGenre>
          <ArtistGenre id="artist3" name="Zain Malik" albumsCount={1} songsCount={7}>
            <AlbumInfo cover={cover3} name="Mind of Mine" artist="Zain Malik" genre="Holiday" />
          </ArtistGenre>
        </div>
      </div>
    )
  }
}
