// @flow

import * as React from 'react'
import connect from '~/common/connect'

import db from '~/db'
import { setSongPlaylist } from '~/redux/songs'
import { getAlbumsFromSongs } from '~/common/songs'

import '~/styles/albums.less'
import cover from '~/static/img/alter-img.png'

import AlbumInfo from './AlbumInfo'
import ReplacementText from './utilities/ReplacementText'

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
  viewWidth: number,
|}

const DEFAULT_WIDTH = 1024

class Albums extends React.Component<Props, State> {
  state = {
    songs: [],
    selected: null,
    viewWidth: DEFAULT_WIDTH,
  }

  componentDidMount() {
    this.fetchSongs()
    window.addEventListener('load', this.handleBodyResize)
    window.addEventListener('resize', this.handleBodyResize)
  }

  componentDidUpdate(prevProps) {
    if (prevProps.nonce !== this.props.nonce) {
      this.fetchSongs()
    }
  }
  componentWillUnmount() {
    window.removeEventListener('load', this.handleBodyResize)
    window.removeEventListener('resize', this.handleBodyResize)
  }

  fetchSongs = async () => {
    const songs = await db.songs.toArray()
    this.setState({ songs })
  }

  playAtIndex = (songs: Array<Object>, index: number) => {
    this.props.setSongPlaylist({
      songs: songs.map(song => song.id),
      index,
    })
  }

  openAlbumInfo = (e: SyntheticEvent<HTMLButtonElement>, album: string) => {
    if (this.state.selected && this.state.selected.identifier === album) {
      this.setState({ selected: null })
      return
    }
    this.setState({
      selected: {
        type: 'album',
        identifier: album,
      },
    })
  }

  handleBodyResize = () => {
    const elt = document.getElementById('albums')
    if (elt) {
      this.setState({ viewWidth: elt.getClientRects()[0].width })
    }
  }

  render() {
    let i = 0
    const { songs, selected, viewWidth } = this.state
    const albums = getAlbumsFromSongs(songs)

    const renderedAlbums = Object.keys(albums).map(album => {
      const albumSongs = albums[album]
      return (
        <div className="album-content" key={album}>
          <div className="album-cover">
            <img alt={cover} src={albumSongs[0].artwork?.album?.uri ? albumSongs[0].artwork.album.uri : cover} />
            <button onClick={() => this.playAtIndex(albumSongs, 0)}>
              <i className="material-icons">play_circle_outline</i>
            </button>
          </div>
          <button className="flex-column" onClick={e => this.openAlbumInfo(e, album)}>
            <b>{album}</b>
            <span>{album !== 'Unknown' ? albumSongs[0].meta && albumSongs[0].meta.artists_original : 'Unknown'}</span>
          </button>
        </div>
      )
    })
    if (selected && selected.type === 'album') {
      const elem = <AlbumInfo key={i++} name={selected.identifier} songs={albums[selected.identifier]} />
      const selectedAlbumIndex = Object.keys(albums).findIndex(a => a === selected.identifier)
      if (selectedAlbumIndex > -1) {
        let insertIndex

        if (viewWidth <= 480) {
          insertIndex = 3 * Math.ceil((selectedAlbumIndex + 1) / 3)
        } else if (viewWidth <= 768 && viewWidth > 480) {
          insertIndex = 4 * Math.ceil((selectedAlbumIndex + 1) / 4)
        } else {
          insertIndex = 5 * Math.ceil((selectedAlbumIndex + 1) / 5)
        }
        if (insertIndex > renderedAlbums.length) {
          renderedAlbums.push(elem)
        } else {
          renderedAlbums.splice(insertIndex, 0, elem)
        }
      }
    }

    return songs.length ? (
      <div className="section-albums bound flex-row flex-wrap" id="albums">
        {renderedAlbums}
      </div>
    ) : (
      <ReplacementText />
    )
  }
}

export default connect(
  ({ songs }) => ({ nonce: songs.nonce }),
  { setSongPlaylist },
)(Albums)
