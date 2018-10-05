// @flow

import React from 'react'
import { compose } from 'recompose'

import db from '~/db'
import { incrementNonce } from '~/redux/songs'
import getEventPath from '~/common/getEventPath'
import type { UserAuthorization } from '~/redux/user'

import services from '~/services'
import connect from '~/common/connect'

import flex from '~/less/flex.less'
import button from '~/less/button.less'
import picker from '~/less/musicPicker.less'
import dropdown from '~/less/dropdown.less'

import googleDriveIcon from '~/static/img/google_drive_icon.png'

type Props = {|
  nonce: number,
  incrementNonce: () => void,
  authorizations: Array<UserAuthorization>,
|}
type State = {|
  opened: boolean,
  authorizationServices: Array<string>,
|}

class Picker extends React.Component<Props, State> {
  state = { opened: false, authorizationServices: [] }
  ref: ?HTMLDivElement = null

  componentDidMount() {
    this.loadServices()
    document.addEventListener('click', this.handleBodyClick)
    document.addEventListener('keydown', this.handleKeyPress)
  }
  componentDidUpdate(prevProps) {
    const { nonce } = this.props
    if (prevProps.nonce !== nonce) {
      this.loadServices()
    }
  }
  componentWillUnmount() {
    document.removeEventListener('click', this.handleBodyClick)
    document.removeEventListener('keydown', this.handleKeyPress)
  }

  loadServices = () => {
    const { authorizations } = this.props
    if (!authorizations.length) {
      console.warn('No authorizations found')
      return
    }
    const { authorizationServices: authorizationServicesState } = this.state

    authorizations.forEach(authorization => {
      this.setState({ authorizationServices: [...authorizationServicesState, authorization.service] })
    })
  }

  handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      this.setState({
        opened: false,
      })
    }
  }
  handleBodyClick = (e: MouseEvent) => {
    if (e.defaultPrevented) {
      return
    }
    const firedOnSelf = getEventPath(e).includes(this.ref)
    if (!firedOnSelf) {
      this.setState({
        opened: false,
      })
    }
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
  }

  render() {
    const { opened, authorizationServices } = this.state

    return (
      <div
        ref={element => {
          this.ref = element
        }}
      >
        <button
          type="button"
          className={`${button.btn} ${button.btn_header}`}
          onClick={() => this.setState({ opened: true })}
        >
          <i title="Add Music" className="material-icons">
            add
          </i>
          Add Music
        </button>
        <div
          className={`${dropdown.dropdown_content} ${picker.picker_content} ${flex.justify_start} ${flex.column} ${
            opened ? '' : 'hidden'
          }`}
        >
          <h3>Choose Service</h3>
          {authorizationServices.find(item => item === 'GoogleDrive') && (
            <button className={`${button.btn} ${flex.justify_start}`} type="button" onClick={this.createPicker}>
              <img className={`${picker.serviceImg}`} src={googleDriveIcon} alt="google_drive_icon" />
              Google Drive
            </button>
          )}
        </div>
      </div>
    )
  }
}

export default compose(
  connect(
    state => ({ authorizations: state.user.authorizations.toArray(), nonce: state.songs.nonce }),
    { incrementNonce },
  ),
)(Picker)
