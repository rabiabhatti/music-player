// @flow

import React from 'react'
import { compose } from 'recompose'

import db from '~/db'
import { incrementNonce } from '~/redux/songs'
import type { UserAuthorization } from '~/redux/user'

import services from '~/services'
import connect from '~/common/connect'

import flex from '~/styles/flex.less'
import button from '~/styles/button.less'
import addMusic from '~/styles/addMusic.less'
import googleDriveIcon from '~/static/img/google_drive_icon.png'
import HeaderDropdown from '~/components/Dropdown/HeaderDropdown'

type Props = {|
  nonce: number,
  incrementNonce: () => void,
  authorizations: Array<UserAuthorization>,
|}
type State = {|
  handleClose: boolean,
  authorizationServices: Array<UserAuthorization>,
|}

class AddMusic extends React.Component<Props, State> {
  state = { authorizationServices: [], handleClose: false }

  componentDidMount() {
    this.loadServices()
  }
  componentDidUpdate(prevProps) {
    const { nonce } = this.props
    if (prevProps.nonce !== nonce) this.loadServices()
  }

  loadServices = () => {
    const { authorizations } = this.props
    if (!authorizations.length) {
      console.warn('No authorizations found')
      return
    }

    authorizations.map(authorization => {
      const { authorizationServices: authorizationServicesState } = this.state
      return this.setState({ authorizationServices: [...authorizationServicesState, authorization] })
    })
  }

  createPicker = (e: SyntheticEvent<HTMLButtonElement>) => {
    e.preventDefault()
    const { authorizations } = this.props
    if (!authorizations.length) {
      console.warn('No authorizations found')
      return
    }
    authorizations.forEach(authorization => {
      const { incrementNonce: incrementNonceProp } = this.props
      const service = services.find(item => item.name === authorization.service)
      if (!service) {
        console.warn('Service not found for authorization', authorization)
        return
      }

      service
        .addFiles(authorization)
        .then(filesChosen => {
          db.songs.bulkAdd(filesChosen)
          incrementNonceProp()
        })
        .catch(console.error)
    })
    this.setState({
      handleClose: true,
    })
  }

  addService(name: string, img: string, alt: string) {
    const { authorizationServices } = this.state
    const auth = authorizationServices.find(item => item.service === name)

    return (
      auth && (
        <button title={name} className={`${button.btn} ${flex.justify_start}`} type="button" onClick={this.createPicker}>
          <img className={`${addMusic.serviceImg}`} src={img} alt={alt} />
          <div className={`${flex.column} ${flex.align_start}`}>
            <span className={`${addMusic.service_user_name}`}>{auth.user_name}</span>
            <span className={`${addMusic.service_email}`}>{auth.email}</span>
          </div>
        </button>
      )
    )
  }

  render() {
    const { handleClose } = this.state

    return (
      <HeaderDropdown handleClose={handleClose} buttonTitle="Add Music" buttonIcon="add" className={`${addMusic.add_music}`}>
        <h3>Choose Service</h3>
        {this.addService('GoogleDrive', googleDriveIcon, 'google_drive_icon')}
      </HeaderDropdown>
    )
  }
}

export default compose(
  connect(
    state => ({ authorizations: state.user.authorizations.toArray(), nonce: state.songs.nonce }),
    { incrementNonce },
  ),
)(AddMusic)
