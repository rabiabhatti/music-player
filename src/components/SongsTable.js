// @flow

import * as React from 'react'

import connect from '~/common/connect'
import { humanizeDuration } from '~/common/songs'
import { setSongPlaylist, songPlay, songPause } from '~/redux/songs'

import flex from '~/less/flex.less'
import table from '~/less/table.less'
import button from '~/less/button.less'
import ContextMenu from '~/components/ContextMenu'
import SongDropdown from '~/components/Dropdown/SongDropdown'

type Props = {|
  title: string,
  songState: string,
  dispatch: Function,
  playlist?: ?Object,
  songs: Array<Object>,
  activeSong: number | null,
|}

type State = {|
  focusedSong: ?Object,
  selected: Array<number>,
  showContextMenu: boolean,
|}

class SongsTable extends React.Component<Props, State> {
  nodes = new Map()
  static defaultProps = {
    playlist: null,
  }

  state = {
    selected: [],
    focusedSong: null,
    showContextMenu: false,
  }

  playAtIndex = (index: number) => {
    const { songs, dispatch } = this.props
    dispatch(
      setSongPlaylist({
        songs: songs.map(song => song.id),
        index,
      }),
    )
  }

  playPause = () => {
    const { songState, dispatch } = this.props
    dispatch(songState === 'playing' ? songPause() : songPlay())
  }

  onContextMenu = (song, e) => {
    e.preventDefault()
    e.persist()
    const elt = document.getElementById('modal-contextmenu-root')
    if (elt) {
      const clickX = e.clientX
      const clickY = e.clientY
      const screenW = window.innerWidth
      const screenH = window.innerHeight

      const eltW = elt.offsetWidth
      const eltH = elt.offsetHeight

      const right = screenW - clickX > eltW
      const left = !right
      const top = screenH - clickY > eltH
      const bottom = !top

      if (right) {
        this.left = `${clickX}px`
      }

      if (left) {
        this.left = `${clickX - eltW}px`
      }

      if (top) {
        this.top = `${clickY - 5}px`
      }

      if (bottom) {
        this.top = `${clickY - eltH - 15}px`
      }
      this.setState({
        focusedSong: song,
        showContextMenu: true,
      })
    }
  }

  selectRow = (e, id: number) => {
    const { selected } = this.state
    const selectedItems = selected.slice()
    // const node = this.nodes.get(i)
    // console.log(node)
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

  top: string
  left: string

  render() {
    const { selected, showContextMenu, focusedSong } = this.state
    const { activeSong, songs, title, playlist, songState } = this.props

    return (
      <div className={`${table.section_songs} bound`}>
        {showContextMenu &&
          focusedSong && (
            <ContextMenu
              top={this.top}
              left={this.left}
              songsIds={selected.length ? selected : [focusedSong.id]}
              handleClose={() => this.setState({ showContextMenu: false, focusedSong: null, selected: [] })}
            />
          )}
        <div className={`${flex.align_center} ${flex.space_between}`}>
          <h2>{title}</h2>
          <button type="button" className={`${button.btn} ${button.btn_playall}`} onClick={() => this.playAtIndex(0)}>
            Play All
          </button>
        </div>
        <table cellSpacing="0">
          <thead>
            <tr>
              <th />
              <th>Title</th>
              <th>Time</th>
              <th>Artist</th>
              <th>Album</th>
              <th>Genre</th>
              <th />
            </tr>
          </thead>
          <tbody style={{ overflow: `${showContextMenu ? 'hidden' : 'scroll'}` }}>
            {songs.map((song, index) => (
              <tr
                key={song.id}
                ref={c => {
                  this.nodes.set(index, c)
                }}
                onClick={e => this.selectRow(e, song.id)}
                onDoubleClick={() => this.playAtIndex(index)}
                onContextMenu={e => this.onContextMenu(song, e)}
                className={`${song.id === activeSong ? `${table.active_song}` : ''} ${
                  selected.includes(song.id) ? `${table.selected}` : ''
                }`}
              >
                {song.id === activeSong ? (
                  <td className={`${table.playingSongIcon}`}>
                    <button type="button" className={`${button.btn} ${button.btn_blue}`} onClick={() => this.playPause()}>
                      <i title={songState === 'playing' ? 'Pause' : 'Play'} className="material-icons">
                        {songState === 'playing' ? 'pause' : 'play_arrow'}
                      </i>
                    </button>
                  </td>
                ) : (
                  <td className={selected.includes(song.id) ? `${table.selected_row}` : `${table.hover_btns}`}>
                    <button
                      type="button"
                      onClick={() => this.playAtIndex(index)}
                      className={`${button.btn} ${button.btn_blue}`}
                    >
                      <i className="material-icons">play_arrow</i>
                    </button>
                  </td>
                )}
                <td>{song.meta.name || song.filename}</td>
                <td>{song.duration ? humanizeDuration(song.duration) : ''}</td>
                <td>{song.meta.artists_original || 'Unknown'}</td>
                <td>{song.meta.album || 'Unknown'}</td>
                <td>{song.meta.genre || 'Unknown'} </td>
                <td className={selected.includes(song.id) ? `${table.selected_row}` : `${table.hover_btns}`}>
                  <SongDropdown song={song} playlist={playlist} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }
}

export default connect(({ songs }) => ({
  songState: songs.songState,
  activeSong: songs.playlist[songs.songIndex] || null,
}))(SongsTable)
