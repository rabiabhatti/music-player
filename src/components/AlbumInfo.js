// @flow

import React from 'react'

import Popup from './Popup'
import Dropdown from './Dropdown'
import SubDropdown from './SubDropdown'

type Props = {|
  cover: string,
  name: string,
  artist: string,
  genre: string,
  year: number,
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
    const { cover, name, artist, genre, year } = this.props
    const { showPlaylistPopup } = this.state

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
              <img alt="album-cover" className="album-cover-img" src={cover} />
              <button className="album-cover-icon align-center">
                <i className="material-icons album-play-btn">play_circle_outline</i>
              </button>
            </div>
            <div className="space-between">
              <p>12 songs, 25 minutes</p>
              <button>Shuffle</button>
            </div>
          </div>
          <div className="album-info-content">
            <div className="space-between section-album-info-header">
              <div>
                <h2>{name}</h2>
                <a href={`#${artist}`} className="album-info-artist btn">
                  {artist}
                </a>
                <p>
                  {genre} &bull; {year}
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
              <div className="song-info space-between align-center flex-wrap">
                <p>1</p>
                <p>Ho ho ho</p>
                <p>3:39</p>
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
              <div className="song-info space-between align-center flex-wrap">
                <p>2</p>
                <p>Snowman</p>
                <p>2:48</p>
                <div className="song-btns space-between">
                  <button>
                    <i className="material-icons song-play-btn">play_arrow</i>
                  </button>
                  <Dropdown>
                    <div className="align-center space-between sub-dropdown-trigger">
                      <a onClick={this.showPlaylistPopupInput}>Add to Playlist</a>
                      <SubDropdown>
                        <a className="dropdown-option">New Playlist</a>
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
              <div className="song-info space-between align-center flex-wrap">
                <p>3</p>
                <p>Everyday Is Christmas</p>
                <p>3:24</p>
                <div className="song-btns space-between">
                  <button>
                    <i className="material-icons song-play-btn">play_arrow</i>
                  </button>
                  <Dropdown>
                    <div className="align-center space-between sub-dropdown-trigger">
                      <a>Add to Playlist</a>
                      <SubDropdown>
                        <a className="dropdown-option">New Playlist</a>
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
              <div className="song-info space-between align-center flex-wrap">
                <p>4</p>
                <p>Ho ho ho</p>
                <p>3:39</p>
                <div className="song-btns space-between">
                  <button>
                    <i className="material-icons song-play-btn">play_arrow</i>
                  </button>
                  <Dropdown>
                    <div className="align-center space-between sub-dropdown-trigger">
                      <a>Add to Playlist</a>
                      <SubDropdown>
                        <a className="dropdown-option">New Playlist</a>
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
              <div className="song-info space-between align-center flex-wrap">
                <p>5</p>
                <p>Snowman</p>
                <p>2:48</p>
                <div className="song-btns space-between">
                  <button>
                    <i className="material-icons song-play-btn">play_arrow</i>
                  </button>
                  <Dropdown>
                    <div className="align-center space-between sub-dropdown-trigger">
                      <a>Add to Playlist</a>
                      <SubDropdown>
                        <a className="dropdown-option">New Playlist</a>
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
              <div className="song-info space-between align-center flex-wrap">
                <p>6</p>
                <p>Everyday Is Christmas</p>
                <p>3:24</p>
                <div className="song-btns space-between">
                  <button>
                    <i className="material-icons song-play-btn">play_arrow</i>
                  </button>
                  <Dropdown>
                    <div className="align-center space-between sub-dropdown-trigger">
                      <a>Add to Playlist</a>
                      <SubDropdown>
                        <a className="dropdown-option">New Playlist</a>
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
              <div className="song-info space-between align-center flex-wrap">
                <p>7</p>
                <p>Snowman</p>
                <p>2:48</p>
                <div className="song-btns space-between">
                  <button>
                    <i className="material-icons song-play-btn">play_arrow</i>
                  </button>
                  <button>
                    <i className="material-icons song-dropdown">more_horiz</i>
                  </button>
                </div>
              </div>
              <div className="song-info space-between align-center flex-wrap">
                <p>8</p>
                <p>Everyday Is Christmas</p>
                <p>3:24</p>
                <div className="song-btns space-between">
                  <button>
                    <i className="material-icons song-play-btn">play_arrow</i>
                  </button>
                  <button>
                    <i className="material-icons song-dropdown">more_horiz</i>
                  </button>
                </div>
              </div>
              <div className="song-info space-between align-center flex-wrap">
                <p>9</p>
                <p>Ho ho ho</p>
                <p>3:39</p>
                <div className="song-btns space-between">
                  <button>
                    <i className="material-icons song-play-btn">play_arrow</i>
                  </button>
                  <button>
                    <i className="material-icons song-dropdown">more_horiz</i>
                  </button>
                </div>
              </div>
              <div className="song-info space-between align-center flex-wrap">
                <p>10</p>
                <p>Snowman</p>
                <p>2:48</p>
                <div className="song-btns space-between">
                  <button>
                    <i className="material-icons song-play-btn">play_arrow</i>
                  </button>
                  <button>
                    <i className="material-icons song-dropdown">more_horiz</i>
                  </button>
                </div>
              </div>
              <div className="song-info space-between align-center flex-wrap">
                <p>11</p>
                <p>Everyday Is Christmas</p>
                <p>3:24</p>
                <div className="song-btns space-between">
                  <button>
                    <i className="material-icons song-play-btn">play_arrow</i>
                  </button>
                  <button>
                    <i className="material-icons song-dropdown">more_horiz</i>
                  </button>
                </div>
              </div>
              <div className="song-info space-between align-center flex-wrap">
                <p>12</p>
                <p>Ho ho ho</p>
                <p>3:39</p>
                <div className="song-btns space-between">
                  <button>
                    <i className="material-icons song-play-btn">play_arrow</i>
                  </button>
                  <button>
                    <i className="material-icons song-dropdown">more_horiz</i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
