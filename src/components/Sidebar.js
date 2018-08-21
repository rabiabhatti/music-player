// @flow

import React from 'react'
import { connect } from 'react-redux'

import db from '~/db'
import { showPopup } from '~/redux/popup'
import { navigateTo, type RouterRoute, type RouteName } from '~/redux/router'

import Popup from './Popup'
import Picker from './Picker'
import Logout from './Logout'

type Props = {|
  route: RouterRoute,
  showPopup: showPopup,
  navigateTo: navigateTo,
|}
type State = {|
  playlists: Array<Object>,
|}

class Sidebar extends React.Component<Props, State> {
  state = {
    playlists: [],
  }

  componentDidMount() {
    db.playlists.toArray().then(playlists => {
      this.setState({ playlists })
    })
  }

  renderNavigationItem(icon: string, routeName: RouteName, name: string = routeName, id: number | null = null) {
    const { route } = this.props

    return (
      <button
        key={`route-${name}-${id !== null ? id : 'none'}`}
        className={`content-row align-center btn-dull ${route.name === routeName && route.id === id ? 'active' : ''}`}
        onClick={() => routeName === 'NewPlaylist' ? this.props.showPopup({ show: true, songsIds:[] }) : this.props.navigateTo({ name: routeName, id })}
      >
        <i className="material-icons row-icon">{icon}</i>
        {name}
      </button>
    )
  }

  render() {
    const { playlists } = this.state

    return (
      <div className="section-sidebar">
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
            {playlists.map(localPlaylist =>
              this.renderNavigationItem('playlist_play', 'Playlist', localPlaylist.name, localPlaylist.id),
            )}
          </div>
          <Picker />
          <Logout />
        </div>
      </div>
    )
  }
}

export default connect(
  ({ router }) => ({ route: router.route }),
  {
    navigateTo,
    showPopup,
  },
)(Sidebar)
