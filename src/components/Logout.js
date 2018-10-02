// @flow

import React from 'react'
import { compose } from 'recompose'

import services from '~/services'
import connect from '~/common/connect'
import { unauthorizeService, type UserAuthorization } from '~/redux/user'

import button from '~/less/button.less'

type Props = {|
  authorizations: Array<UserAuthorization>,
  unauthorizeService: unauthorizeService,
|}
type State = {||}

class Logout extends React.Component<Props, State> {
  handleSignoutClick = (e: SyntheticEvent<HTMLButtonElement>) => {
    e.preventDefault()

    const { authorizations, unauthorizeService: unauthorizeServiceProp } = this.props
    authorizations.forEach(authorization => {
      const service = services.find(i => i.name === authorization.service)
      if (!service) {
        console.warn('Unable to find service for authorization', authorization)
        return
      }
      service.unauthorize(authorization)
      unauthorizeServiceProp({ authorization })
    })
  }

  render() {
    return (
      <button type="button" className={`${button.btn} ${button.btn_header}`} onClick={this.handleSignoutClick}>
        <i className="material-icons">account_circle</i>
        Account
      </button>
    )
  }
}

export default compose(
  connect(
    state => ({ authorizations: state.user.authorizations.toArray() }),
    { unauthorizeService },
  ),
)(Logout)
