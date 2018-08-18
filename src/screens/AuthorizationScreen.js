// @flow

import React from 'react'

import services from '~/services'
import connect from '~/common/connect'
import { authorizeService } from '~/redux/user'

import type { Service } from '~/services/types'

type Props = {|
  authorizeService: authorizeService,
|}
type State = {||}

class Login extends React.Component<Props, State> {
  authorize = (service: Service, e: SyntheticEvent<HTMLButtonElement>) => {
    e.preventDefault()

    service
      .authorize()
      .then(auth => {
        this.props.authorizeService({ authorization: auth })
      })
      .catch(console.error)
  }

  render() {
    return (
      <div className="section-login align-center">
        {services.map(service => (
          <button className="btn-blue" onClick={e => this.authorize(service, e)} key={service.name}>
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
