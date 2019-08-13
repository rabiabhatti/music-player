// @flow

import React from 'react'
import { connect } from 'react-redux'
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import PlayerScreen from './screens/PlayerScreen'
import PrivacyScreen from './screens/PrivacyScreen'
import AuthorizationScreen from './screens/AuthorizationScreen'

const Router = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
    return(
        <BrowserRouter>
            <div>
                <Switch>
                    <Route exact path='/' component={isLoggedIn ? PlayerScreen : AuthorizationScreen} />
                    <Route path='/privacy' component={PrivacyScreen} />
                </Switch>
            </div>
        </BrowserRouter>
    )
}

export default connect(({ user }) => ({ isLoggedIn: user.authorizations.length }))(Router)
