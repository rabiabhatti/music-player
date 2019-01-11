// @flow

import React from 'react'

import flex from '~/styles/flex.less'
import emptyMusic from '~/styles/empty-music.less'

export default () => (
  <div className={`${flex.align_center} ${flex.justify_center} ${emptyMusic.container} bound`}>
    <h2 className={`${emptyMusic.text}`}>Add Music</h2>
  </div>
)
