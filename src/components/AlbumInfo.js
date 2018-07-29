// @flow

import React from 'react'

import type { File } from '~/services/types'
import { humanizeDuration } from '~/common/songs'

import Popup from './Popup'
import Dropdown from './Dropdown'
import SubDropdown from './SubDropdown'

type Props = {|
  name: string,
  songs: Array<File>,
|}
type State = {|
  showPlaylistPopup: number | null,
|}

export default class AlbumInfo extends React.Component<Props, State> {
  state = {
    showPlaylistPopup: null,
  }

  showPlaylistPopupInput = (e: SyntheticInputEvent<HTMLInputElement>) => {
    e.preventDefault()
    this.setState({ showPlaylistPopup: Date.now() })
  }

  render() {
    const { songs, name } = this.props
    const { showPlaylistPopup } = this.state
    let i = 1

    const totalDuration = songs.reduce((agg, curr) => agg + curr.duration, 0)

    return (
      <div id="album-info">
        {showPlaylistPopup ? (
          <Popup hash={showPlaylistPopup.toString()}>
            <input type="text" placeholder="Choose name" />
            <button className="btn-blue">Save</button>
          </Popup>
        ) : (
          <div />
        )}
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
              <button>Shuffle</button>
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
                  <a>Add to Playlist</a>
                  <SubDropdown>
                    <a onClick={this.showPlaylistPopupInput} className="dropdown-option">
                      New Playlist
                    </a>
                    <a className="dropdown-option">90's</a>
                    <a className="dropdown-option">Peace of Mind</a>
                    <a className="dropdown-option">Rock n Roll</a>
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
                    <button>
                      <i className="material-icons song-play-btn">play_arrow</i>
                    </button>
                    <Dropdown>
                      <div className="align-center space-between sub-dropdown-trigger">
                        <a onClick={this.showPlaylistPopupInput}>Add to Playlist</a>
                        <SubDropdown>
                          <a onClick={this.showPlaylistPopupInput} className="dropdown-option">
                            New Playlist
                          </a>
                          <a className="dropdown-option">90's</a>
                          <a className="dropdown-option">Peace of Mind</a>
                          <a className="dropdown-option">Rock n Roll</a>
                        </SubDropdown>
                      </div>
                      <a className="dropdown-option">Play Next</a>
                      <a className="dropdown-option">Play Later</a>
                      <a className="dropdown-option">Delete from Library</a>
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
