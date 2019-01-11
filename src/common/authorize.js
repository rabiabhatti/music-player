// @flow

import services from '~/services'
import type { Service } from '~/services/types'
import {
  unauthorizeService as unauthorizeServiceType,
  type UserAuthorization,
  authorizeService as authorizeServiceType,
} from '~/redux/user'

export function authorize(service: Service, authorizeService: authorizeServiceType) {
  return service
    .authorize()
    .then(authorization => {
      authorizeService({ authorization })
    })
    .catch(console.error)
}

export function unauthorize(authorization: UserAuthorization, unauthorizeService: unauthorizeServiceType) {
  const service = services.find(i => i.name === authorization.service)
  if (!service) {
    console.warn('Unable to find service for authorization', authorization)
    return
  }
  service.unauthorize(authorization)
  unauthorizeService({ authorization })
}
