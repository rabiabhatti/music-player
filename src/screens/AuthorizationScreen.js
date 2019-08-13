// @flow

import React from 'react'

import services from '~/services'
import { connect } from 'react-redux'
import { authorize } from '~/common/authorize'
import { authorizeService } from '~/redux/user'

import flex from '~/styles/flex.less'
import login from '~/styles/login.less'
import button from '~/styles/button.less'

type Props = {|
  authorizeService: typeof authorizeService,
|}

function Login(props: Props) {
  return (
    <div className={`${login.login} ${flex.align_center}`}>
      {services.map(service => (
        <button
          type="button"
          key={service.name}
          onClick={() => authorize(service, props.authorizeService)}
          className={`${button.btn} ${button.btn_blue_border}`}
        >
          Authorize with {service.name}
        </button>
      ))}
    </div>
  )
}

export default connect(
  null,
  { authorizeService },
)(Login)
