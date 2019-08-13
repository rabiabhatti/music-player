// @flow

import React from 'react'

import { connect } from 'react-redux'
import contextMenu from '~/common/contextMenu'
import getEventPath from '~/common/getEventPath'
import { humanizeDuration } from '~/common/songs'
import { setSongPlaylist, songPlay, songPause, showSongContextMenu } from '~/redux/songs'

import flex from '~/styles/flex.less'
import button from '~/styles/button.less'
import albumInfo from '~/styles/album-info.less'

import cover from '~/static/img/alter-img.png'

import ContextMenu from '~/components/ContextMenu'
import SongDropdown from '~/components/Dropdown/SongDropdown'
import AlbumDropdown from '~/components/Dropdown/AlbumDropdown'

type Props = {|
  name: string,
  songState: string,
  dispatch: Function,
  songs: Array<Object>,
  showContextMenu: boolean,
  activeSong: number | null,
|}
type State = {|
  focusedSong: ?Object,
  selected: Array<number>,
|}

class AlbumInfo extends React.Component<Props, State> {
  ref: ?HTMLDivElement = null

  state = {
    selected: [],
    focusedSong: null,
  }

  componentDidMount() {
    document.addEventListener('click', this.handleBodyClick)
  }
  componentWillUnmount() {
    document.removeEventListener('click', this.handleBodyClick)
  }

  handleBodyClick = (e: MouseEvent) => {
    if (e.defaultPrevented) {
      return
    }
    const firedOnSelf = getEventPath(e).includes(this.ref)
    if (!firedOnSelf) {
      this.setState({
        selected: [],
      })
    }
  }

  playAtIndex = (index: number, ids: Array<number>) => {
    const { dispatch } = this.props
    dispatch(
      setSongPlaylist({
        songs: ids,
        index,
      }),
    )
  }

  playPause = () => {
    const { songState, dispatch } = this.props
    dispatch(songState === 'playing' ? songPause() : songPlay())
  }

  contextMenu = async (song, e) => {
    e.preventDefault()
    e.persist()
    const { dispatch } = this.props
    const elt = document.getElementById('modal-contextmenu-root')
    if (elt) {
      dispatch(showSongContextMenu(true))
      const { menuPostion } = await contextMenu(e, elt)

      this.left = `${menuPostion.x}px`
      this.top = `${menuPostion.y}px`

      this.setState({
        focusedSong: song,
      })
    }
  }

  selectRow = (e: MouseEvent, id: number) => {
    e.preventDefault()
    const { selected } = this.state
    const selectedItems = selected.slice()
    const index = selected.indexOf(id)
    if (index === -1) {
      if (e.shiftKey) {
        this.setState({
          selected: [...selected, id],
        })
        return
      }
      this.setState({
        selected: [id],
      })
    } else {
      if (e.shiftKey) {
        selectedItems.splice(index, 1)
        this.setState({
          selected: selectedItems,
        })
        return
      }
      this.setState({
        selected: [],
      })
    }
  }

  handleContextMenuClose = () => {
    const { dispatch } = this.props
    dispatch(showSongContextMenu(false))
    this.setState({ focusedSong: null, selected: [] })
  }

  top: string
  left: string

  render() {
    const { songs, name, activeSong, songState, showContextMenu } = this.props
    const { selected, focusedSong } = this.state

    const songsIds = songs.map(s => s.id)
    const totalDuration = songs.reduce((agg, curr) => agg + curr.duration, 0)

    return (
      <div className={`${albumInfo.album_info} ${flex.wrap} ${flex.space_between}`}>
        {showContextMenu && focusedSong && (
          <ContextMenu
            top={this.top}
            left={this.left}
            handleClose={this.handleContextMenuClose}
            songsIds={selected.length ? selected : [focusedSong.id]}
          />
        )}
        <div className={`${flex.column} ${albumInfo.album_title}`}>
          <div className={`${albumInfo.album_cover}`}>
            <div className={`${albumInfo.filter}`} />
            <img
              alt="album-cover"
              src={
                songs[0].artwork && songs[0].artwork.album && songs[0].artwork.album.uri ? songs[0].artwork.album.uri : cover
              }
            />
            <button
              type="button"
              className={`${button.btn} ${flex.align_center}`}
              onClick={() => this.playAtIndex(0, songsIds)}
            >
              <i className={`${albumInfo.album_play_btn} material-icons`}>play_circle_outline</i>
            </button>
          </div>
          <div className={`${flex.space_between}`}>
            <p>
              {songs.length} songs, {totalDuration ? humanizeDuration(totalDuration) : ''} minutes
            </p>
            <button
              type="button"
              className={`${button.btn} ${button.btn_blue}`}
              onClick={() => this.playAtIndex(0, songsIds)}
            >
              Shuffle
            </button>
          </div>
        </div>
        <div className={`${albumInfo.album_info_content}`}>
          <div className={`${flex.space_between}`}>
            <div>
              <h2>{name === 'undefined' ? 'Unkown' : name}</h2>
              <h2 className={`${albumInfo.artistLink}`}>{songs[0].meta && songs[0].meta.artists_original}</h2>
              <p>
                {songs[0].meta && songs[0].meta.genre ? songs[0].meta.genre : 'Unkown'} &bull;{' '}
                {songs[0].meta && songs[0].meta.year ? songs[0].meta.year : 'Unkown'}
              </p>
            </div>
            <AlbumDropdown songsIds={songsIds} />
          </div>
          <div
            ref={element => {
              this.ref = element
            }}
            className={`${flex.column} ${albumInfo.songs_container}`}
          >
            {songs.map((song, index) => (
              <a
                href="/"
                key={song.sourceId}
                onClick={e => this.selectRow(e, song.id)}
                onContextMenu={e => this.contextMenu(song, e)}
                onDoubleClick={() => this.playAtIndex(index, songsIds)}
                className={`${flex.space_between} ${flex.align_center} ${flex.wrap} ${albumInfo.song_row} ${
                  song.id === activeSong ? `${albumInfo.active_song}` : ''
                } ${selected.includes(song.id) ? `${albumInfo.selected}` : ''}`}
              >
                {song.id === activeSong ? (
                  <button type="button" className={`${button.btn} ${button.btn_blue}`} onClick={() => this.playPause()}>
                    <i
                      title={songState === 'playing' ? 'Pause' : 'Play'}
                      className={`${albumInfo.active_song_icon} material-icons`}
                    >
                      {songState === 'playing' ? 'pause' : 'play_arrow'}
                    </i>
                  </button>
                ) : (
                  <React.Fragment>
                    <p className={`${albumInfo.odd_item}`}>{index + 1}</p>
                    <button
                      type="button"
                      className={`${button.btn} ${button.btn_blue} ${albumInfo.song_play_btn}`}
                      onClick={() => this.playAtIndex(index, songsIds)}
                    >
                      <i className="material-icons">play_arrow</i>
                    </button>
                  </React.Fragment>
                )}
                <p className={`${albumInfo.song_title}`}>
                  {song.meta && typeof song.meta.name !== 'undefined' ? song.meta.name : song.filename.replace('.mp3', '')}
                </p>
                <p className={`${selected.includes(song.id) ? `${albumInfo.hide}` : `${albumInfo.odd_item}`}`}>
                  {song.duration ? humanizeDuration(song.duration) : ''}
                </p>
                <SongDropdown
                  song={song}
                  classname={` ${selected.includes(song.id) ? `${albumInfo.show}` : `${albumInfo.song_dropdown}`}`}
                />
              </a>
            ))}
          </div>
        </div>
      </div>
    )
  }
}

export default connect(({ songs }) => ({
  activeSong: songs.playlist[songs.songIndex] || null,
  songState: songs.songState,
  showContextMenu: songs.showContextMenu,
}))(AlbumInfo)
