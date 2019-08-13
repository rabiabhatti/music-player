// @flow
import { createAction } from 'redux-actions'

import services from '~/services'
import type { Service } from '~/services/types'
import { type UserAuthorization } from '~/redux/user'
import { AUTHORIZE_SERVICE, UNAUTHORIZE_SERVICE } from './types'

export function authorize(service: Service) {
  return (dispatch: createAction) => {
    service
        .authorize()
        .then(authorization => {
          console.log('auth', authorization)
          dispatch({
            type: AUTHORIZE_SERVICE,
            authorization,
          })
        })
        .catch(console.error)
  }
}

export function unauthorize(authorization: UserAuthorization) {
  return (dispatch: createAction) => {
    const service = services.find(i => i.name === authorization.service)
    if (!service) {
      console.warn('Unable to find service for authorization', authorization)
      return
    }
    service.unauthorize(authorization)
    dispatch({
      type: UNAUTHORIZE_SERVICE,
      authorization
    })
  }


}
