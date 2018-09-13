// @flow

import * as React from 'react'
import connect from '~/common/connect'

import db from '~/db'
import { deletePlaylist } from '~/common/songs'
import { incrementNonce } from '~/redux/songs'
import { navigateTo, type RouterRoute, type RouteName } from '~/redux/router'

import '~/css/sidebar.css'
import Picker from '~/components/utilities/Picker'
import EditPlaylist from '~/components/utilities/Popup/EditPlaylist'
import CreateNewPlaylist from '~/components/utilities/Popup/CreateNewPlaylist'

import Logout from './Logout'

type Props = {|
  nonce: number,
  route: RouterRoute,
  navigateTo: navigateTo,
  incrementNonce: () => void,
|}
type State = {|
  id: ?number,
  name: ?string,
  playlists: Array<Object>,
  showCreatePlaylistModal: boolean,
  showEditPlaylistModal: boolean,
|}

class Sidebar extends React.Component<Props, State> {
  state = {
    id: null,
    name: null,
    playlists: [],
    showEditPlaylistModal: false,
    showCreatePlaylistModal: false,
  }

  componentDidMount() {
    this.fetchPlaylists()
  }
  componentDidUpdate(prevProps) {
    if (prevProps.nonce !== this.props.nonce) {
      this.fetchPlaylists()
    }
  }
  fetchPlaylists = () => {
    db.playlists.toArray().then(playlists => {
      this.setState({ playlists })
    })
  }

  deletePlaylist = (e: SyntheticEvent<HTMLButtonElement>, id: number) => {
    deletePlaylist(id)
    this.props.incrementNonce()
  }

  showEditPlaylistModal = (e: SyntheticEvent<HTMLButtonElement>, name: string, id: number) => {
    this.setState({
      id,
      name,
      showEditPlaylistModal: true,
    })
  }
  hideEditPlaylistModal = () => {
    this.setState({
      id: null,
      name: null,
      showEditPlaylistModal: false,
    })
  }
  showCreatePlaylistModal = () => {
    this.setState({ showCreatePlaylistModal: true })
  }
  hideCreatePlaylistModal = () => {
    this.setState({ showCreatePlaylistModal: false })
  }

  renderNavigationItem(icon: string, routeName: RouteName, name: string = routeName) {
    const { route } = this.props

    return (
      <button
        key={`route-${name}`}
        className={`content-row align-center btn-dull ${route.name === routeName ? 'active' : ''}`}
        onClick={() =>
          routeName === 'NewPlaylist' ? this.showCreatePlaylistModal() : this.props.navigateTo({ name: routeName })
        }
      >
        <i className="material-icons">{icon}</i>
        {name}
      </button>
    )
  }

  renderPlaylists(icon: string, routeName: RouteName, name: string = routeName, id: number) {
    const { route } = this.props
    return (
      <div
        key={`route-${name}-${id}`}
        className={`content-row space-between align-center flex-row btn-dull section-sidebar-playlist ${
          route.name === routeName && route.id === id ? 'active' : ''
        }`}
      >
        <button className="btn-dull playlist-button" onClick={() => this.props.navigateTo({ name: routeName, id })}>
          <i className="material-icons row-icon">{icon}</i>
          {name}
        </button>
        <div className="flex-row section-sidebar-playlist-icons">
          <button onClick={e => this.showEditPlaylistModal(e, name, id)}>
            <i title="Edit Playlist" className="material-icons">
              edit
            </i>
          </button>
          <button onClick={e => this.deletePlaylist(e, id)}>
            <i title="Delete from Library" className="material-icons">
              delete
            </i>
          </button>
        </div>
      </div>
    )
  }

  render() {
    const { playlists, showCreatePlaylistModal, showEditPlaylistModal, name, id } = this.state

    return (
      <div className="section-sidebar">
        {showCreatePlaylistModal && <CreateNewPlaylist handleClose={this.hideCreatePlaylistModal} />}
        {showEditPlaylistModal && <EditPlaylist handleClose={this.hideEditPlaylistModal} name={name} id={id} />}
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
            {playlists.map(playlist => this.renderPlaylists('playlist_play', 'Playlist', playlist.name, playlist.id))}
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
    incrementNonce,
  },
)(Sidebar)
