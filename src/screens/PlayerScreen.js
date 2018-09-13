// @flow

import * as React from 'react'
import connect from '~/common/connect'

import type { RouteName, RouterRoute } from '~/redux/router'

import '~/styles/general.less'

import Songs from '~/components/Songs'
import Genres from '~/components/Genres'
import Albums from '~/components/Albums'
import Player from '~/components/Player'
import Sidebar from '~/components/Sidebar'
import Artists from '~/components/Artists'
import Playlist from '~/components/Playlist'
import Downloader from '~/components/utilities/Downloader'
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
  route: RouterRoute,
|}

function PlayerScreen(props: Props) {
  const ActiveRoute = ROUTES[props.route.name]

  return (
    <React.Fragment>
      <Downloader />
      <Player />
      <div className="app-wrapper space-between">
        <Sidebar />
        <ActiveRoute />
      </div>
    </React.Fragment>
  )
}

export default connect(({ router }) => ({
  route: router.route,
}))(PlayerScreen)
