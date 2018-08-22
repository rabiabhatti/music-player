// @flow

import React from 'react'
import { connect } from 'react-redux'

import db from '~/db'
import { showPopup } from '~/redux/popup'
import { setSongPlaylist } from '~/redux/songs'
import { humanizeDuration, addSongsToPlaylist } from '~/common/songs'

import '~/css/album-info.css'

import Dropdown from './Dropdown'
import SubDropdown from './SubDropdown'

type Props = {|
  name: string,
  showPopup: showPopup,
  songs: Array<Object>,
  setSongPlaylist: typeof setSongPlaylist,
|}
type State = {|
  playlists: Array<Object> | null,
|}

class AlbumInfo extends React.Component<Props, State> {
  state = {
    playlists: null,
  }

  async componentDidMount() {
    const playlists = await db.playlists.toArray()
    this.setState({ playlists: playlists })
  }

  render() {
    const { songs, name } = this.props
    const { playlists } = this.state
    let i = 1

    const totalDuration = songs.reduce((agg, curr) => agg + curr.duration, 0)

    let songsIdsArr = []
    songs.forEach(song => {
      songsIdsArr.push(song.id)
    })

    return (
      <div id="album-info">
        <div className="section-album-info space-between flex-wrap">
          <div className="album-title flex-column">
            <div className="album-cover">
              <div className="album-cover-filter" />
              <img alt="album-cover" className="album-cover-img" src={null} />
              <button className="album-cover-icon align-center">
                <i className="material-icons album-play-btn">play_circle_outline</i>
              </button>
            </div>
            <div className="space-between">
              <p>
                {songs.length} songs, {humanizeDuration(totalDuration)} minutes
              </p>
              <button onClick={() => this.props.setSongPlaylist(songsIdsArr)}>Shuffle</button>
            </div>
          </div>
          <div className="album-info-content">
            <div className="space-between section-album-info-header">
              <div>
                <h2>{name === 'undefined' ? 'Unkown' : name}</h2>
                <a href={`#`} className="album-info-artist btn">
                  {songs[0].meta && songs[0].meta.album_artists.join(', ')}
                </a>
                <p>
                  {songs[0].meta && songs[0].meta.genre ? songs[0].meta.genre : 'Unkown'} &bull;{' '}
                  {songs[0].meta && songs[0].meta.year ? songs[0].meta.year : 'Unkown'}
                </p>
              </div>
              <Dropdown>
                <div className="align-center space-between sub-dropdown-trigger">
                  <button>Add to Playlist</button>
                  <SubDropdown>
                    <button
                      onClick={() =>
                        this.props.showPopup({
                          show: true,
                          songsIds: songsIdsArr,
                        })
                      }
                      className="dropdown-option"
                    >
                      New Playlist
                    </button>
                    {playlists &&
                      playlists.map(playlist => (
                        <button
                          key={playlist.id}
                          className="dropdown-option"
                          onClick={() => addSongsToPlaylist(songsIdsArr, playlist.id)}
                        >
                          {playlist.name}
                        </button>
                      ))}
                  </SubDropdown>
                </div>
                <a className="dropdown-option">Play Next</a>
                <a className="dropdown-option">Play Later</a>
                <a className="dropdown-option">Delete from Library</a>
              </Dropdown>
            </div>
            <div className="section-album-songs-table flex-column">
              {songs.map(song => (
                <div className="song-info space-between align-center flex-wrap" key={song.sourceId}>
                  <p>{i++}</p>
                  <p>
                    {song.meta && typeof song.meta.name !== 'undefined' ? song.meta.name : song.filename.replace('.mp3', '')}
                  </p>
                  <p>{humanizeDuration(song.duration)}</p>
                  <div className="song-btns space-between">
                    <button onClick={() => this.props.setSongPlaylist([song.id])}>
                      <i className="material-icons song-play-btn">play_arrow</i>
                    </button>
                    <Dropdown>
                      <div className="align-center space-between sub-dropdown-trigger">
                        <button>Add to Playlist</button>
                        <SubDropdown>
                          <button
                            onClick={() =>
                              this.props.showPopup({
                                show: true,
                                songsIds: [song.id],
                              })
                            }
                            className="dropdown-option"
                          >
                            New Playlist
                          </button>
                          {playlists &&
                            playlists.map(playlist => (
                              <button
                                key={playlist.id}
                                className="dropdown-option"
                                onClick={() => addSongsToPlaylist([song.id], playlist.id)}
                              >
                                {playlist.name}
                              </button>
                            ))}
                        </SubDropdown>
                      </div>
                      <button className="dropdown-option">Play Next</button>
                      <button className="dropdown-option">Play Later</button>
                      <button className="dropdown-option">Delete from Library</button>
                    </Dropdown>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(
  null,
  { setSongPlaylist, showPopup },
)(AlbumInfo)
