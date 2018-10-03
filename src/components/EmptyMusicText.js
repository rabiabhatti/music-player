// @flow

import React from 'react'

import flex from '~/less/flex.less'
import emptyMusic from '~/less/empty-music.less'

export default () => (
  <div className={`${flex.align_center} ${flex.justify_center} ${emptyMusic.container} bound`}>
    <h2 className={`${emptyMusic.text}`}>Add Music</h2>
  </div>
)
