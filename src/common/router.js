// @flow

import { createAction } from 'redux-actions'

import { NAVIGATE_TO } from './types'
import { type RouterRoute } from '~/redux/router'

export function navigateTo(route: RouterRoute) {
    return (dispatch: createAction) => {
        dispatch({
            type: NAVIGATE_TO,
            route
        })
    }
}