// @flow

import * as React from 'react'
import connect from '~/common/connect'

import type { RouteName, RouterRoute } from '~/redux/router'

import '~/styles/general.less'

import Player from '~/components/Player'
import Sidebar from '~/components/Sidebar'
import Songs from '~/components/routes/Songs'
import Genres from '~/components/routes/Genres'
import Albums from '~/components/routes/Albums'
import Downloader from '~/components/Downloader'
import Artists from '~/components/routes/Artists'
import Playlist from '~/components/routes/Playlist'
import RecentlyPlayed from '~/components/routes/RecentlyPlayed'

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
  const { route } = props
  const ActiveRoute = ROUTES[route.name]

  return (
    <React.Fragment>
      <Downloader />
      <div className="space-between align-stretch">
        <Sidebar />
        <ActiveRoute />
      </div>
      <Player />
    </React.Fragment>
  )
}

export default connect(({ router }) => ({
  route: router.route,
}))(PlayerScreen)
