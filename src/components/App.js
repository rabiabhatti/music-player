// @flow

import * as React from 'react'
import { compose } from 'recompose'

import connect from '../common/connect'
import services from '../services'
import type { ComponentsStateSelected } from '~/redux/components'

import Login from './Login'
import Songs from './Songs'
import Albums from './Albums'
import Genres from './Genres'
import Player from './Player'
import Loading from './Loading'
import Sidebar from './Sidebar'
import Artists from './Artists'
import Downloader from './Downloader'
import RecentlyPlayed from './RecentlyPlayed'

type Props = {|
  hasAuthorization: boolean,
  selected: ComponentsStateSelected,
|}
type State = {|
  loading: boolean,
  showLoadingScreen: boolean,
|}

const SHOW_LOADING_SCREEN_IN = 600 // ms

class App extends React.Component<Props, State> {
  state = { loading: true, showLoadingScreen: false }

  components = {
    songs: Songs,
    artists: Artists,
    albums: Albums,
    genres: Genres,
    recentlyplayed: RecentlyPlayed,
  }

  componentDidMount() {
    const timeout = setTimeout(() => {
      if (this.state.loading) {
        this.setState({ showLoadingScreen: true })
      }
    }, SHOW_LOADING_SCREEN_IN)
    Promise.all(services.map(service => service.load()))
      .then(() => {
        clearTimeout(timeout)
        this.setState({ loading: false })
      })
      .catch(console.error)
  }
  render() {
    const { hasAuthorization, selected } = this.props
    const { showLoadingScreen, loading } = this.state
    const Component = this.components[selected.type.toLowerCase()]

    if (showLoadingScreen) {
      return <Loading />
    }
    if (loading) {
      return null
    }
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
  connect(
    state =>
      console.log(state) || {
        hasAuthorization: !!state.user.authorizations.size,
        selected: state.components.selected,
      },
  ),
)(App)
