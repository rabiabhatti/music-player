// @flow

import React from 'react'
import connect from '~/common/connect'

import type { RouteName, RouterRoute } from '~/redux/router'

import Albums from '~/components/Albums'
import Player from '~/components/Player'
import Sidebar from '~/components/Sidebar'
import Artists from '~/components/Artists'
import Playlist from '~/components/Playlist'
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

const PlayerScreen = ({ route }: { route: RouterRoute }) => {
  const ActiveRoute = ROUTES[route.name]

  return (
    <div>
      <Player />
      <div className="app-wrapper space-between">
        <Sidebar />
        <ActiveRoute />
      </div>
    </div>
  )
}

export default connect(({ router }) => ({ route: router.route }))(PlayerScreen)
