// @flow

import React from 'react'

import services from '~/services'
import connect from '~/common/connect'
import { authorizeService } from '~/redux/user'

import type { Service } from '~/services/types'

import flex from '~/less/flex.less'
import login from '~/less/login.less'
import button from '~/less/button.less'

type Props = {|
  authorizeService: typeof authorizeService,
|}
type State = {||}

class Login extends React.Component<Props, State> {
  authorize = (service: Service, e: SyntheticEvent<HTMLButtonElement>) => {
    e.preventDefault()
    const { authorizeService: authorizeServiceProp } = this.props
    service
      .authorize()
      .then(authorization => {
        authorizeServiceProp({ authorization })
      })
      .catch(console.error)
  }

  render() {
    return (
      <div className={`${login.login} ${flex.align_center}`}>
        {services.map(service => (
          <button
            type="button"
            key={service.name}
            onClick={e => this.authorize(service, e)}
            className={`${button.btn} ${button.btn_blue_border}`}
          >
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
