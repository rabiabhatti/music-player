// @flow

import * as React from 'react'
import connect from '~/common/connect'

import type { RouteName, RouterRoute } from '~/redux/router'

import '~/less/general.less'

import Player from '~/components/Player'
import Header from '~/components/Header'
import Sidebar from '~/components/Sidebar'
import Songs from '~/components/routes/Songs'
import Genres from '~/components/routes/Genres'
import ResponsiveHeader from '~/components/Header/ResponsiveHeader'
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
type State = {|
  viewWidth: number,
|}
const DEFAULT_WIDTH = 1024

class PlayerScreen extends React.Component<Props, State> {
  state = {
    viewWidth: DEFAULT_WIDTH,
  }

  componentDidMount() {
    window.addEventListener('load', this.handleBodyResize)
    window.addEventListener('resize', this.handleBodyResize)
  }

  componentWillUnmount() {
    window.removeEventListener('load', this.handleBodyResize)
    window.removeEventListener('resize', this.handleBodyResize)
  }

  handleBodyResize = () => {
    const elt = document.getElementById('root')
    if (elt) {
      this.setState({ viewWidth: elt.getClientRects()[0].width })
    }
  }

  render() {
    const { route } = this.props
    const { viewWidth } = this.state
    const ActiveRoute = ROUTES[route.name]

    return (
      <React.Fragment>
        <Downloader />
        {viewWidth <= 480 ? <ResponsiveHeader /> : <Header />}
        {viewWidth > 480 && <Sidebar />}
        <ActiveRoute />
        <Player />
      </React.Fragment>
    )
  }
}

export default connect(({ router }) => ({
  route: router.route,
}))(PlayerScreen)
