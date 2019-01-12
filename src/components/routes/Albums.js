// @flow

import * as React from 'react'
import connect from '~/common/connect'

import { setSongPlaylist } from '~/redux/songs'
import { getAlbumsFromSongs } from '~/common/songs'

import flex from '~/styles/flex.less'
import button from '~/styles/button.less'
import albumsDesign from '~/styles/albums.less'
import albumInfo from '~/styles/album-info.less'

import cover from '~/static/img/alter-img.png'

import AlbumInfo from '../AlbumInfo'
import PreLoader from '~/components/PreLoader'

type Props = {|
  setSongPlaylist: setSongPlaylist,
|}
type State = {|
  selected: ?{|
    identifier: string,
  |},
  viewWidth: number,
|}

const DEFAULT_WIDTH = 1024

class Albums extends React.Component<Props, State> {
  state = {
    selected: null,
    viewWidth: DEFAULT_WIDTH,
  }

  componentDidMount() {
    window.addEventListener('load', this.handleBodyResize)
    window.addEventListener('resize', this.handleBodyResize)
  }

  componentWillUnmount() {
    window.removeEventListener('load', this.handleBodyResize)
    window.removeEventListener('resize', this.handleBodyResize)
  }

  playAtIndex = (songs: Array<Object>, index: number) => {
    const { setSongPlaylist: setSongPlaylistProp } = this.props
    setSongPlaylistProp({
      songs: songs.map(song => song.id),
      index,
    })
  }

  openAlbumInfo = (e: SyntheticEvent<HTMLButtonElement>, album: string) => {
    const { selected } = this.state
    if (selected && selected.identifier === album) {
      this.setState({ selected: null })
      return
    }
    this.setState({
      selected: {
        identifier: album,
      },
    })
  }

  handleBodyResize = () => {
    const elt = document.getElementById('root')
    if (elt) this.setState({ viewWidth: elt.getClientRects()[0].width })
  }

  render() {
    let i = 0
    const { selected, viewWidth } = this.state

    return (
      <PreLoader classname={`${albumsDesign.albums} ${flex.wrap}`}>
        {({ songs }) => {
          const albums = getAlbumsFromSongs(songs)
          const renderedAlbums = Object.keys(albums).map(album => {
            const albumSongs = albums[album]
            let coverImg

            if (albumSongs[0].artwork && albumSongs[0].artwork.album && albumSongs[0].artwork.album.uri !== null) {
              coverImg = albumSongs[0].artwork.album.uri
            } else {
              coverImg = cover
            }
            return (
              <div className={`${albumsDesign.album_content}`} key={album}>
                <div className={`${albumInfo.album_cover}`}>
                  <div className={`${albumInfo.filter}`} />
                  <img alt={cover} src={coverImg} />
                  <button
                    type="button"
                    className={`${button.btn} ${flex.align_center}`}
                    onClick={() => this.playAtIndex(albumSongs, 0)}
                  >
                    <i className="material-icons">play_circle_outline</i>
                  </button>
                </div>
                <button
                  type="button"
                  className={`${button.btn} ${flex.column} ${albumsDesign.desc}`}
                  onClick={e => this.openAlbumInfo(e, album)}
                  onDoubleClick={() => this.playAtIndex(albumSongs, 0)}
                >
                  <b>{album}</b>
                  <span>{album !== 'Unknown' ? albumSongs[0].meta && albumSongs[0].meta.artists_original : 'Unknown'}</span>
                </button>
              </div>
            )
          })
          if (selected) {
            const elem = <AlbumInfo key={i++} name={selected.identifier} songs={albums[selected.identifier]} />
            const selectedAlbumIndex = Object.keys(albums).findIndex(a => a === selected.identifier)
            if (selectedAlbumIndex > -1) {
              let itemsInRow

              if (viewWidth <= 480) {
                itemsInRow = 3
              } else if (viewWidth <= 768 && viewWidth > 480) {
                itemsInRow = 4
              } else {
                itemsInRow = 5
              }

              const insertIndex = itemsInRow * Math.ceil((selectedAlbumIndex + 1) / itemsInRow)
              if (insertIndex > renderedAlbums.length) {
                renderedAlbums.push(elem)
              } else {
                renderedAlbums.splice(insertIndex, 0, elem)
              }
            }
          }

          return renderedAlbums
        }}
      </PreLoader>
    )
  }
}

export default connect(
  null,
  { setSongPlaylist },
)(Albums)
