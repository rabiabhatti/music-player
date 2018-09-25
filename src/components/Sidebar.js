// @flow

import * as React from 'react'
import connect from '~/common/connect'

import db from '~/db'
import { incrementNonce } from '~/redux/songs'
import { navigateTo, type RouterRoute, type RouteName } from '~/redux/router'

import '~/styles/sidebar.less'
import Picker from '~/components/Picker'
import EditPlaylist from '~/components/Popup/EditPlaylist'
import CreateNewPlaylist from '~/components/Popup/CreateNewPlaylist'

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
    const { nonce } = this.props
    if (prevProps.nonce !== nonce) {
      this.fetchPlaylists()
    }
  }
  fetchPlaylists = () => {
    db.playlists.toArray().then(playlists => {
      this.setState({ playlists })
    })
  }

  navigateTo = (e: SyntheticEvent<HTMLButtonElement>, name: string, id: ?number) => {
    const { navigateTo: navigateToProp } = this.props
    navigateToProp({ name, id })
  }

  deletePlaylist = async (e: SyntheticEvent<HTMLButtonElement>, id: number) => {
    const { incrementNonce: incrementNonceProp } = this.props
    await db.playlists.delete(id)
    incrementNonceProp()
  }

  showCreatePlaylistModal = () => {
    this.setState({ showCreatePlaylistModal: true })
  }

  renderNavigationItem(icon: string, routeName: RouteName, name: string = routeName) {
    const { route } = this.props

    return (
      <button
        type="submit"
        key={`route-${name}`}
        className={`btn-dull ${route.name === routeName ? 'active' : ''}`}
        onClick={e => (routeName === 'NewPlaylist' ? this.showCreatePlaylistModal() : this.navigateTo(e, routeName))}
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
        className={`space-between flex-row btn-dull section-sidebar-playlist ${
          route.name === routeName && route.id === id ? 'active' : ''
        }`}
      >
        <button type="button" className="btn-dull" onClick={e => this.navigateTo(e, routeName, id)}>
          <i className="material-icons">{icon}</i>
          {name}
        </button>
        <div className="flex-row">
          <button
            type="submit"
            onClick={() =>
              this.setState({
                id,
                name,
                showEditPlaylistModal: true,
              })
            }
          >
            <i title="Edit Playlist" className="material-icons">
              edit
            </i>
          </button>
          <button type="button" onClick={e => this.deletePlaylist(e, id)}>
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
        {showCreatePlaylistModal && (
          <CreateNewPlaylist handleClose={() => this.setState({ showCreatePlaylistModal: false })} />
        )}
        {showEditPlaylistModal && (
          <EditPlaylist
            name={name}
            id={id}
            handleClose={() =>
              this.setState({
                id: null,
                name: null,
                showEditPlaylistModal: false,
              })
            }
          />
        )}
        <input id="sidebar-search-input" type="text" placeholder="Search" />
        <h3>Library</h3>
        {this.renderNavigationItem('access_time', 'RecentlyPlayed', 'Recently Played')}
        {this.renderNavigationItem('music_note', 'Songs')}
        {this.renderNavigationItem('album', 'Albums')}
        {this.renderNavigationItem('mic', 'Artists')}
        {this.renderNavigationItem('queue_music', 'Genres')}
        <h3>PlayLists</h3>
        {this.renderNavigationItem('playlist_add', 'NewPlaylist', 'New')}
        {playlists.map(playlist => this.renderPlaylists('playlist_play', 'Playlist', playlist.name, playlist.id))}
        <Picker />
        <Logout />
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
