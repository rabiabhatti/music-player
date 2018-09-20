// @flow

import React from 'react'

import services from '~/services'
import connect from '~/common/connect'
import { authorizeService } from '~/redux/user'

import '~/styles/login.less'
import type { Service } from '~/services/types'

type Props = {|
  authorizeService: typeof authorizeService,
|}
type State = {||}

class Login extends React.Component<Props, State> {
  authorize = (service: Service, e: SyntheticEvent<HTMLButtonElement>) => {
    e.preventDefault()

    service
      .authorize()
      .then(authorization => {
        this.props.authorizeService({ authorization })
      })
      .catch(console.error)
  }

  render() {
    return (
      <div className="section-login align-center">
        {services.map(service => (
          <button type="button" className="btn-blue-border" onClick={e => this.authorize(service, e)} key={service.name}>
            Authorize with {service.name}
          </button>
        ))}
      </div>
    )
  }
}

export default connect(
  null,
  { authorizeService },
)(Login)
