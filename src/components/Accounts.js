// @flow

import * as React from 'react'
import { compose } from 'recompose'

import services from '~/services'
import connect from '~/common/connect'
import { authorize, unauthorize } from '~/common/authorize'
import { unauthorizeService, type UserAuthorization } from '~/redux/user'

import flex from '~/less/flex.less'
import button from '~/less/button.less'
import authServices from '~/less/account.less'
import HeaderDropdown from '~/components/Dropdown/HeaderDropdown'

type Props = {|
  nonce: number,
  authorizations: Array<UserAuthorization>,
  unauthorizeService: unauthorizeService,
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
    if (prevProps.nonce !== nonce) {
      this.loadServices()
    }
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

  renderAuthBtn(): ?Array<?React.Element<button>> {
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
            <span>{service.name}</span>
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

  renderUnuthBtn(): ?Array<?React.Element<button>> {
    const { authorizations, unauthorizeService: unauthorizeServiceProp } = this.props

    return services.map(service => {
      const found = authorizations.find(item => item.service !== service.name)
      if (found) {
        return (
          <div className={`${flex.space_between} ${flex.align_baseline}`} key={`unauthorize-${service.name}`}>
            <span>{service.name}</span>
            <button
              type="button"
              onClick={() => authorize(service, unauthorizeServiceProp)}
              className={`${button.btn} ${button.btn_blue_border}`}
            >
              Signin
            </button>
          </div>
        )
      }
      return null
    })
  }

  render() {
    return (
      <HeaderDropdown buttonTitle="Account" buttonIcon="account_circle" className={`${authServices.services_content}`}>
        <h3>Services</h3>
        {this.renderAuthBtn()}
        {this.renderUnuthBtn()}
      </HeaderDropdown>
    )
  }
}

export default compose(
  connect(
    state => ({ authorizations: state.user.authorizations.toArray(), nonce: state.songs.nonce }),
    { unauthorizeService },
  ),
)(Accounts)
