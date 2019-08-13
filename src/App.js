import 'normalize.css'
import React from 'react'
import { Provider } from 'react-redux'
import { hot } from 'react-hot-loader'
import { PersistGate } from "redux-persist/integration/react"

import Router from './router'
import LoadingScreen from './screens/LoadingScreen'

import services from './services'
import { store as reduxStore, persistor } from './redux'

const SHOW_LOADING_SCREEN_IN = 600 // ms

class Root extends React.Component {
  state = { store: null, error: null, loading: true, showLoadingScreen: false }

  componentDidMount() {
    const timeout = setTimeout(() => {
      const { loading } = this.state
      if (loading) {
        this.setState({ showLoadingScreen: true })
      }
    }, SHOW_LOADING_SCREEN_IN)
    Promise.all([reduxStore, ...services.map(service => service.load())])
      .then(([store]) => {
        clearTimeout(timeout)
        this.setState({ store, loading: false, showLoadingScreen: false })
      })
      .catch(error => {
        this.setState({ error })
      })
  }

  render() {
    const { error, store, loading, showLoadingScreen } = this.state

    if (error) {
      return <div>Error while getting store: {error && error.message}</div>
    }
    if (showLoadingScreen) {
      return <LoadingScreen />
    }
    if (loading) {
      return <div />
    }

    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Router />
        </PersistGate>
      </Provider>
    )
  }
}

export default hot(module)(Root)
