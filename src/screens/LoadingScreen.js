// @flow

import React from 'react'

import flex from '~/less/flex.less'
import loading from '~/less/loading.less'

export default () => (
  <div className={`${loading.loading} ${flex.align_center}`}>
    <svg viewBox="-25 -25 100 100" className={`${loading.loading_icon}`}>
      <circle fill="#1967d2" stroke="none" cx="6" cy="25" r="6">
        <animateTransform
          attributeName="transform"
          dur="0.7s"
          type="translate"
          values="0 15 ; 0 -15; 0 15"
          repeatCount="indefinite"
          begin="0.1s"
        />
        <animate attributeName="opacity" dur="0.7s" values="0;1;0" repeatCount="indefinite" begin="0.1s" />
      </circle>
      <circle fill="#1967d2" stroke="none" cx="30" cy="25" r="6">
        <animateTransform
          attributeName="transform"
          dur="0.7s"
          type="translate"
          values="0 10 ; 0 -10; 0 10"
          repeatCount="indefinite"
          begin="0.2"
        />
        <animate attributeName="opacity" dur="0.7s" values="0;1;0" repeatCount="indefinite" begin="0.2" />
      </circle>
      <circle fill="#1967d2" stroke="none" cx="54" cy="25" r="6">
        <animateTransform
          attributeName="transform"
          dur="0.7s"
          type="translate"
          values="0 5 ; 0 -5; 0 5"
          repeatCount="indefinite"
          begin="0.3"
        />
        <animate attributeName="opacity" dur="0.7s" values="0;1;0" repeatCount="indefinite" begin="0.3" />
      </circle>
    </svg>
  </div>
)
