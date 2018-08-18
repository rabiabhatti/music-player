// @flow

import React from 'react'
import connect from '~/common/connect'

import PlayerScreen from './screens/PlayerScreen'
import AuthorizationScreen from './screens/AuthorizationScreen'

const Router = ({ isLoggedIn }: { isLoggedIn: boolean }) => (isLoggedIn ? <PlayerScreen /> : <AuthorizationScreen />)

export default connect(({ user }) => ({ isLoggedIn: !!user.authorizations.size }))(Router)
