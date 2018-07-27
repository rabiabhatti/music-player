// @flow

import * as React from 'react'

import ArtistGenre from './ArtistGenre'
import AlbumInfo from './AlbumInfo'

import cover from '../static/img/album-cover.jpg'
import cover3 from '../static/img/album-cover-3.png'
import cover4 from '../static/img/album-cover-4.jpg'

type Props = {||}
type State = {||}

export default class Genres extends React.Component<Props, State> {
  render() {
    return (
      <div className="section-artists bound">
        <div className="artists-bar">
          <a className="align-center artists-bar-row active" href="#artist1">
            <i className="material-icons artists-bar-row-icon">queue_music</i>
            <span>Holiday</span>
          </a>
          <a className="align-center artists-bar-row" href="#artist2">
            <i className="material-icons artists-bar-row-icon">queue_music</i>
            <span>Country</span>
          </a>
          <a className="align-center artists-bar-row" href="#artist3">
            <i className="material-icons artists-bar-row-icon">queue_music</i>
            <span>Rock</span>
          </a>
        </div>
        <div className="section-artists-info">
          <ArtistGenre id="artist1" name="Holiday" albumsCount={1} songsCount={7}>
            <AlbumInfo cover={cover} name="Everyday Is Christmas" artist="Sia Furler" genre="Holiday" year={1234} />
          </ArtistGenre>
          <ArtistGenre id="artist2" name="Country" albumsCount={1} songsCount={7}>
            <AlbumInfo cover={cover3} name="Mind of Mine" artist="Zain Malik" genre="Holiday" year={1234} />
          </ArtistGenre>
          <ArtistGenre id="artist3" name="Rock" albumsCount={1} songsCount={7}>
            <AlbumInfo cover={cover4} name="1989" artist="Taylor Swift" genre="Holiday" year={1234} />
          </ArtistGenre>
        </div>
      </div>
    )
  }
}
