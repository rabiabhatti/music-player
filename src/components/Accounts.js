// @flow

import * as React from 'react'
import { compose } from 'recompose'

import services from '~/services'
import connect from '~/common/connect'
import { authorize, unauthorize } from '~/common/authorize'
import { unauthorizeService, authorizeService, type UserAuthorization } from '~/redux/user'

import flex from '~/styles/flex.less'
import button from '~/styles/button.less'
import authServices from '~/styles/account.less'
import HeaderDropdown from '~/components/Dropdown/HeaderDropdown'

type Props = {|
  nonce: number,
  authorizations: Array<UserAuthorization>,
  unauthorizeService: unauthorizeService,
  authorizeService: authorizeService,
|}
type State = {|
  authorizationServices: Array<string>,
|}

class Accounts extends React.Component<Props, State> {
  state = { authorizationServices: [] }

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

    authorizations.forEach(authorization => {
      const { authorizationServices: authorizationServicesState } = this.state
      this.setState({ authorizationServices: [...authorizationServicesState, authorization.service] })
    })
  }

  renderUnauthenticateServices(): ?Array<?React.Element<button>> {
    const { authorizations, unauthorizeService: unauthorizeServiceProp } = this.props
    if (!authorizations.length) {
      console.warn('No authorizations found')
      return null
    }

    return authorizations.map(authorization => {
      const service = services.find(item => item.name === authorization.service)
      if (service) {
        return (
          <div className={`${flex.space_between} ${flex.align_baseline}`} key={`unauthorize-${authorization.uid}`}>
            <div className={`${flex.column} ${authServices.auth_desc}`}>
              <span className={`${authServices.service_name}`}>{service.name}</span>
              <span className={`${authServices.service_email}`}>{authorization.email}</span>
            </div>
            <button
              type="button"
              className={`${button.btn} ${button.btn_blue_border} ${authServices.auth_btn} ${flex.justify_center}`}
              onClick={() => unauthorize(authorization, unauthorizeServiceProp)}
            >
              Logout
            </button>
          </div>
        )
      }
      return null
    })
  }

  renderAuthenticateServices(): ?Array<?React.Element<button>> {
    const { authorizeService: authorizeServiceProp } = this.props

    return services.map(service => (
      <div className={`${flex.space_between} ${flex.align_baseline}`} key={`service-${service.name}`}>
        <span>{service.name}</span>
        <button
          type="button"
          onClick={() => authorize(service, authorizeServiceProp)}
          className={`${button.btn} ${button.btn_blue_border}`}
        >
          Signin
        </button>
      </div>
    ))
  }

  render() {
    return (
      <HeaderDropdown buttonTitle="Account" buttonIcon="account_circle" className={`${authServices.services_content}`}>
        <h3>Accounts</h3>
        {this.renderUnauthenticateServices()}
        {this.renderAuthenticateServices()}
      </HeaderDropdown>
    )
  }
}

export default compose(
  connect(
    state => ({ authorizations: state.user.authorizations.toArray(), nonce: state.songs.nonce }),
    { unauthorizeService, authorizeService },
  ),
)(Accounts)
