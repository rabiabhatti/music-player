// @flow

import React from 'react'
import { connect } from 'react-redux'

import db from '~/db'
import { navigateTo, type RouterRoute, type RouteName } from '~/redux/router'

import CreateNewPlaylist from '~/components/Popup/CreateNewPlaylist'
import '~/css/sidebar.css'
import Picker from './Picker'
import Logout from './Logout'

type Props = {|
  nonce: number,
  route: RouterRoute,
  navigateTo: navigateTo,
|}
type State = {|
  playlists: Array<Object>,
  showCreatePlaylistModal: boolean,
|}

class Sidebar extends React.Component<Props, State> {
  state = {
    playlists: [],
    showCreatePlaylistModal: false,
  }

  componentDidMount() {
    this.fetchPlaylists()
  }
  componentWillReceiveProps(newProps) {
    if (newProps.nonce !== this.props.nonce) {
      this.fetchPlaylists()
    }
  }
  fetchPlaylists = () => {
    db.playlists.toArray().then(playlists => {
      this.setState({ playlists })
    })
  }

  showCreatePlaylistModal = () => {
    this.setState({ showCreatePlaylistModal: true })
  }
  hideCreatePlaylistModal = () => {
    this.setState({ showCreatePlaylistModal: false })
  }

  renderNavigationItem(icon: string, routeName: RouteName, name: string = routeName, id: number | null = null) {
    const { route } = this.props

    return (
      <button
        key={`route-${name}-${id !== null ? id : 'none'}`}
        className={`content-row align-center btn-dull ${route.name === routeName && route.id === id ? 'active' : ''}`}
        onClick={() =>
          routeName === 'NewPlaylist' ? this.showCreatePlaylistModal() : this.props.navigateTo({ name: routeName, id })
        }
      >
        <i className="material-icons row-icon">{icon}</i>
        {name}
      </button>
    )
  }

  render() {
    const { playlists, showCreatePlaylistModal } = this.state

    return (
      <div className="section-sidebar">
        {showCreatePlaylistModal && <CreateNewPlaylist handleClose={this.hideCreatePlaylistModal} />}
        <div className="flex-column">
          <input id="sidebar-search-input" type="text" placeholder="Search" />
          <div className="sidebar-content flex-column">
            <h3>Library</h3>
            {this.renderNavigationItem('access_time', 'RecentlyPlayed', 'Recently Played')}
            {this.renderNavigationItem('music_note', 'Songs')}
            {this.renderNavigationItem('album', 'Albums')}
            {this.renderNavigationItem('mic', 'Artists')}
            {this.renderNavigationItem('queue_music', 'Genres')}
          </div>
          <div className="sidebar-content flex-column">
            <h3>PlayLists</h3>
            {this.renderNavigationItem('playlist_add', 'NewPlaylist', 'New')}
            {playlists.map(playlist => this.renderNavigationItem('playlist_play', 'Playlist', playlist.name, playlist.id))}
          </div>
          <Picker />
          <Logout />
        </div>
      </div>
    )
  }
}

export default connect(
  ({ router, songs }) => ({ route: router.route, nonce: songs.nonce }),
  {
    navigateTo,
  },
)(Sidebar)
