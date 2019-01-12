// @flow

import React from 'react'

import flex from '~/styles/flex.less'
import header from '~/styles/header.less'

import Accounts from '~/components/Accounts'
import Search from './Search'

export default function Header() {
  return (
    <div className={`${header.header} ${flex.row} ${flex.justify_end}`}>
      <Search />
      <Accounts />
    </div>
  )
}
