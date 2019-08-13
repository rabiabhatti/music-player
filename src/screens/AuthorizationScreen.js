// @flow

import React from 'react'

import services from '~/services'
import { connect } from 'react-redux'
import { authorize } from '~/common/authorize'

import flex from '~/styles/flex.less'
import login from '~/styles/login.less'
import button from '~/styles/button.less'

type Props = {|
  authorize: Function,
|}

function Login(props: Props) {
  return (
    <div className={`${login.login} ${flex.align_center}`}>
      {services.map(service => (
        <button
          type="button"
          key={service.name}
          onClick={() => props.authorize(service)}
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
  { authorize },
)(Login)
