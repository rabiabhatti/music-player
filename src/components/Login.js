// @flow

import React from 'react'
import { compose } from 'recompose'

import services from '../services'
import connect from '../common/connect'
import { authorizeService } from '../redux/user'

type Props = {|
  authorizeService: authorizeService,
|}
type State = {||}

class Login extends React.Component<Props, State> {
  handleAuthClick = (e: SyntheticEvent<HTMLButtonElement>) => {
    e.preventDefault()
    const googleDrive = services.find(i => i.name === 'googledrive')
    if (!googleDrive) {
      console.warn('Unable to find googledrive in services')
      return
    }
    googleDrive
      .authorize()
      .then(auth => {
        this.props.authorizeService({ authorization: auth })
      })
      .catch(console.error)
  }

  render() {
    return (
      <div className="section-login align-center">
        <button id="authorize-button" className="btn-blue" onClick={this.handleAuthClick}>
          Signin with Google Drive
        </button>
        <pre id="content" />
      </div>
    )
  }
}

export default compose(connect(null, { authorizeService }))(Login)
