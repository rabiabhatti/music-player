// @flow

import React from 'react'
import { connect } from 'react-redux'

import db from '~/db'
import { setSelected, playlistSelected, type ComponentsStateSelected } from '~/redux/components'

import Popup from './Popup'
import Picker from './Picker'
import Logout from './Logout'

type Props = {|
  selected: Object,
  playlist: Object,
  setSelected: typeof setSelected,
  playlistSelected: typeof playlistSelected,
|}
type State = {|
  playlists: Array<Object>,
  showPlaylistPopup: number | null,
|}

class Sidebar extends React.Component<Props, State> {
  state = {
    playlists: [],
    showPlaylistPopup: null,
  }

  async componentDidMount() {
    const playlists = await db.playlists.toArray()
    this.setState({ playlists: playlists })
  }

  handlePlaylistClick = (id: number) => e => {
    e.preventDefault()
    this.props.setSelected({ type: 'Playlist' })
    this.props.playlistSelected({ id: id })
  }

  showPlaylistPopupInput = (e: SyntheticInputEvent<HTMLInputElement>) => {
    e.preventDefault()
    this.setState({ showPlaylistPopup: Date.now() })
  }

  render() {
    const { selected, playlist } = this.props
    const { playlists, showPlaylistPopup } = this.state

    return (
      <div className="section-sidebar">
        {showPlaylistPopup && <Popup hash={showPlaylistPopup.toString()} songsIds={[]} />}
        <div className="flex-column">
          <input id="sidebar-search-input" type="text" placeholder="Search" />
          <div className="sidebar-content flex-column">
            <h3>Library</h3>
            <a
              className={`content-row align-center ${selected && selected.type === 'RecentlyPlayed' ? 'active' : ''}`}
              onClick={() => this.props.setSelected({ type: 'RecentlyPlayed' })}
            >
              <i className="material-icons row-icon">access_time</i>Recently Played
            </a>
            <a
              className={`content-row align-center ${selected && selected.type === 'Songs' ? 'active' : ''}`}
              onClick={() => this.props.setSelected({ type: 'Songs' })}
            >
              <i className="material-icons row-icon">music_note</i>Songs
            </a>
            <a
              className={`content-row align-center ${selected && selected.type === 'Albums' ? 'active' : ''}`}
              onClick={() => this.props.setSelected({ type: 'Albums' })}
            >
              <i className="material-icons row-icon">album</i>Albums
            </a>
            <a
              className={`content-row align-center ${selected && selected.type === 'Artists' ? 'active' : ''}`}
              onClick={() => this.props.setSelected({ type: 'Artists' })}
            >
              <i className="material-icons row-icon">mic</i>Artists
            </a>
            <a
              className={`content-row align-center ${selected && selected.type === 'Genres' ? 'active' : ''}`}
              onClick={() => this.props.setSelected({ type: 'Genres' })}
            >
              <i className="material-icons row-icon">queue_music</i>Genres
            </a>
          </div>
          <div className="sidebar-content flex-column">
            <h3>PlayLists</h3>
            <a onClick={this.showPlaylistPopupInput} className="content-row align-center">
              <i className="material-icons row-icon">playlist_add</i>
              New
            </a>
            {playlists.map(loaclPlaylist => (
              <a
                key={loaclPlaylist.id}
                className={`content-row align-center ${
                  selected && selected.type === 'Playlist' && playlist && playlist.id === loaclPlaylist.id ? 'active' : ''
                }`}
                onClick={this.handlePlaylistClick(loaclPlaylist.id)}
              >
                <i className="material-icons row-icon">playlist_play</i>
                {loaclPlaylist.name}
              </a>
            ))}
          </div>
          <Picker />
          <Logout />
        </div>
      </div>
    )
  }
}

export default connect(({ components }) => ({ selected: components.selected, playlist: components.playlist }), {
  setSelected,
  playlistSelected,
})(Sidebar)
