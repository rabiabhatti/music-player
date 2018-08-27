// @flow

import * as React from 'react'
import connect from '~/common/connect'

import { type Popup } from '~/redux/popup'
import type { RouteName, RouterRoute } from '~/redux/router'

import '~/css/general.css'

import PopupComponent from '~/components/Popup'
import Albums from '~/components/Albums'
import Player from '~/components/Player'
import Sidebar from '~/components/Sidebar'
import Artists from '~/components/Artists'
import Playlist from '~/components/Playlist'
import Downloader from '~/components/Downloader'
import Genres from '~/components/Genres'
import Songs from '~/components/Songs'
import RecentlyPlayed from '~/components/RecentlyPlayed'

const ROUTES: { [RouteName]: $FlowFixMe } = {
  Albums,
  Artists,
  Playlist,
  Genres,
  Songs,
  RecentlyPlayed,
}

type Props = {|
  popup: Popup,
  route: RouterRoute,
|}
type State = {|
  showPlaylistPopup: number | null,
|}

class PlayerScreen extends React.Component<Props, State> {
  state = {
    showPlaylistPopup: null,
  }

  componentWillReceiveProps({ popup }) {
    if (popup.show) {
      this.setState({ showPlaylistPopup: Date.now() })
    } else {
      this.setState({ showPlaylistPopup: null })
    }
  }

  render() {
    const ActiveRoute = ROUTES[this.props.route.name]
    const { showPlaylistPopup } = this.state

    return (
      <React.Fragment>
        {showPlaylistPopup !== null && (
          <PopupComponent hash={showPlaylistPopup.toString()} songsIds={this.props.popup.songsIds} />
        )}
        <Downloader />
        <Player />
        <div className="app-wrapper space-between">
          <Sidebar />
          <ActiveRoute />
        </div>
      </React.Fragment>
    )
  }
}

export default connect(({ router, popup }) => ({
  route: router.route,
  popup: popup.popup,
}))(PlayerScreen)
