import 'normalize.css'

import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import App from './components/App'
import getReduxStore from './redux'

class Root extends React.Component {
  state = { store: null, error: null }

  componentDidMount() {
    getReduxStore().then(
      store => {
        this.setState({ store })
      },
      error => {
        this.setState({ error })
      },
    )
  }

  render() {
    const { error, store } = this.state

    if (error) {
      return <div>Error while getting store: {error && error.message}</div>
    }
    if (!store) {
      return <div>Loading</div>
    }

    return (
      <Provider store={store}>
        <App />
      </Provider>
    )
  }
}

ReactDOM.render(<Root />, document.getElementById('root'))
