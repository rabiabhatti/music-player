// @flow

import * as React from 'react'
import { connect } from 'react-redux'

import db from '~/db'
import { setSongPlaylist } from '~/redux/songs'
import { getAlbumsFromSongs } from '~/common/songs'

import '~/css/albums.css'
import AlbumInfo from './AlbumInfo'

import cover from '../static/img/alter-img.png'

type Props = {|
  nonce: number,
  setSongPlaylist: setSongPlaylist,
|}
type State = {|
  songs: Array<Object>,
  selected: ?{|
    type: string,
    identifier: string,
  |},
|}

class Albums extends React.Component<Props, State> {
  state = {
    songs: [],
    selected: null,
  }

  componentDidMount() {
    this.fetchSongs()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.nonce !== this.props.nonce) {
      this.fetchSongs()
    }
  }

  fetchSongs = async () => {
    const dbSongs = await db.songs.toArray()
    this.setState({ songs: dbSongs })
  }

  playAtIndex = (songs: Array<Object>, index: number) => {
    this.props.setSongPlaylist({
      songs: songs.map(song => song.id),
      index,
    })
  }

  render() {
    const { songs, selected } = this.state
    const albums = getAlbumsFromSongs(songs)

    let songsToShow = songs
    if (selected) {
      if (selected.type === 'album') {
        songsToShow = albums[selected.identifier]
      }
    }

    return (
      <React.Fragment>
        {this.state.songs.length ? (
          <div className="section-albums bound">
            <div className="section-albums-container">
              {Object.keys(albums).map(album => {
                const albumSongs = albums[album]
                return (
                  <React.Fragment key={album}>
                    <div className="album-content">
                      <div className="album-cover">
                        <div className="album-cover-filter" />
                        <img
                          alt="album-cover"
                          className="album-cover-img"
                          src={albumSongs[0].artwork?.album?.uri ? albumSongs[0].artwork.album.uri : cover}
                        />
                        <button className="album-cover-icon" onClick={() => this.playAtIndex(albumSongs, 0)}>
                          <i className="material-icons">play_circle_outline</i>
                        </button>
                      </div>
                      <button
                        className="album-infomation flex-column"
                        onClick={() =>
                          this.setState({
                            selected: { type: 'album', identifier: album },
                          })
                        }
                      >
                        <h4 className="album-name">{album}</h4>
                        <p className="album-artist">
                          {album !== 'Unknown' ? albumSongs[0].meta && albumSongs[0].meta.artists_original : 'Unknown'}
                        </p>
                      </button>
                    </div>
                    {selected &&
                      selected.type === 'album' &&
                      selected.identifier === album && <AlbumInfo name={album} songs={songsToShow} />}
                  </React.Fragment>
                )
              })}
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

export default connect(
  ({ songs }) => ({ nonce: songs.nonce }),
  { setSongPlaylist },
)(Albums)
