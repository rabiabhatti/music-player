// @flow

import * as React from 'react'
import { compose } from 'recompose'

import connect from '../common/connect'
import services from '../services'

import Login from './Login'
import Player from './Player'
import Loading from './Loading'
import Sidebar from './Sidebar'
import Artists from './Artists'
import Downloader from './Downloader'

type Props = {|
  hasAuthorization: boolean,
  children?: React$Node,
|}
type State = {|
  loading: boolean,
  showLoadingScreen: boolean,
|}

const SHOW_LOADING_SCREEN_IN = 600 // ms

class App extends React.Component<Props, State> {
  state = { loading: true, showLoadingScreen: false }

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
    const { hasAuthorization, children } = this.props
    const { showLoadingScreen, loading } = this.state

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
          <Artists />
          {children}
        </div>
      </React.Fragment>
    )
  }
}

export default compose(
  connect(state => ({
    hasAuthorization: !!state.user.authorizations.size,
  })),
)(App)
