// @flow

import * as React from 'react'
import groupBy from 'lodash/groupBy'
import flatten from 'lodash/flatten'

import db from '~/db'

import ArtistGenre from './ArtistGenre'
import AlbumInfo from './AlbumInfo'

import cover from '../static/img/album-cover.jpg'
import cover3 from '../static/img/album-cover-3.png'
import cover4 from '../static/img/album-cover-4.jpg'

type Props = {||}
type State = {|
  songs: Array<Object>,
  artistsListWithSongs: Array<Object>,
  albumsList: Object,
|}

export default class Artists extends React.Component<Props, State> {
  state = {
    songs: [],
    artistsListWithSongs: [],
    albumsList: {},
  }

  async componentDidMount() {
    const dbSongs = await db.songs.toArray()
    this.setState({ songs: dbSongs })

    await this.groupedByArtist()
    await this.groupedByAlbum()
  }

  groupedByArtist = async () => {
    const { songs } = this.state
    const songsByArtist = await groupBy(songs, function(song) {
      return song.artist ? song.artist : 'Unknown'
    })
    const artistsListWithSongs = Object.keys(songsByArtist)
      .sort()
      .map(artistName => ({ artist: artistName, songs: songsByArtist[artistName] }))

    this.setState({ artistsListWithSongs: artistsListWithSongs })
  }

  groupedByAlbum = async () => {
    const { songs } = this.state
    const groupedByAlbum = await groupBy(songs, function(song) {
      return song.album ? song.album : 'Unknown'
    })
    this.setState({ albumsList: groupedByAlbum })
  }

  render() {
    const { songs, artistsListWithSongs, albumsList } = this.state

    return (
      <div className="section-artists bound">
        <div className="artists-bar">
          <a className="align-center artists-bar-row active" href="#allArtists">
            <i className="material-icons artists-bar-row-icon">mic</i>
            <span>All Artists</span>
          </a>
          {artistsListWithSongs.map(artistWithSongs => (
            <a className="align-center artists-bar-row" href={`#${artistWithSongs.artist}`} key={artistWithSongs.artist}>
              <i className="material-icons artists-bar-row-icon">person</i>
              <span>{artistWithSongs.artist}</span>
            </a>
          ))}
        </div>
        <div className="section-artists-info">
          {artistsListWithSongs.map(artistWithSongs =>
            artistWithSongs.songs.map(song => [
              artistWithSongs.artist != 'Unknown' ? (
                <ArtistGenre id="allArtists" name="All Artists" albumsCount={3} songsCount={songs.length}>
                  {songs.map(song => (
                    <AlbumInfo
                      cover={cover}
                      name={song.album}
                      artist={song.artist}
                      genre={song.meta.genre}
                      key={song.sourceId}
                      year={song.meta.year}
                    />
                  ))}
                </ArtistGenre>
              ) : (
                <div />
              ),
              <ArtistGenre
                id={artistWithSongs.artist}
                name={artistWithSongs.artist}
                albumsCount={3}
                songsCount={artistWithSongs.songs.length}
                key={song.sourceId}
              >
                <AlbumInfo
                  cover={song.meta.picture}
                  name={song.album}
                  artist={artistWithSongs.artist}
                  genre={song.meta.genre}
                  year={song.meta.year}
                />
              </ArtistGenre>,
            ]),
          )}
        </div>
      </div>
    )
  }
}
