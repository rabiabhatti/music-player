// @flow

import * as React from 'react'
import { compose } from 'recompose'

import type { RouterState } from '~/redux/router'

import connect from '../common/connect'

import Login from './Login'
import Songs from './Songs'
import Albums from './Albums'
import Genres from './Genres'
import Player from './Player'
import Loading from './Loading'
import Sidebar from './Sidebar'
import Artists from './Artists'
import Playlist from './Playlist'
import Downloader from './Downloader'
import RecentlyPlayed from './RecentlyPlayed'

type Props = {|
  router: RouterState,
  hasAuthorization: boolean,
|}
type State = {|
  loading: boolean,
  showLoadingScreen: boolean,
|}

const SHOW_LOADING_SCREEN_IN = 600 // ms

class App extends React.Component<Props, State> {
  components = {
    songs: Songs,
    artists: Artists,
    albums: Albums,
    genres: Genres,
    playlist: Playlist,
    recentlyplayed: RecentlyPlayed,
  }

  render() {
    const { hasAuthorization, selected } = this.props
    const Component = this.components[selected.type.toLowerCase()]

    if (!hasAuthorization) {
      return <Login />
    }

    return (
      <React.Fragment>
        <Downloader />
        <Player />
        <div className="app-wrapper space-between">
          <Sidebar />
          <Component />
        </div>
      </React.Fragment>
    )
  }
}

export default compose(
  connect(state => ({
    hasAuthorization: !!state.user.authorizations.size,
    selected: state.components.selected,
  })),
)(App)
