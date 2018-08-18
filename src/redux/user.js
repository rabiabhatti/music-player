// @flow

import { Set as ImmSet, Record, type RecordOf, type RecordFactory } from 'immutable'
import { createAction, handleActions } from 'redux-actions'
import type { ServiceName } from '~/types'

const AUTHORIZE_SERVICE = 'USER/AUTHORIZE_SERVICE'
const UNAUTHORIZE_SERVICE = 'USER/UNAUTHORIZE_SERVICEs'

export type UserAuthorization = {|
  uid: string,
  meta: Object,
  service: ServiceName,
|}
export type UserStateFields = {|
  authorizations: ImmSet<UserAuthorization>,
|}

export type UserState = RecordOf<UserStateFields>
const createUserState: RecordFactory<UserStateFields> = Record({
  authorizations: new ImmSet(),
})

export const authorizeService = createAction(AUTHORIZE_SERVICE, (payload: { authorization: UserAuthorization }) => payload)
export const unauthorizeService = createAction(
  UNAUTHORIZE_SERVICE,
  (payload: { authorization: UserAuthorization }) => payload,
)

export default handleActions(
  {
    [AUTHORIZE_SERVICE]: (state: UserState, { payload: { authorization } }) =>
      state.merge({
        authorizations: state.authorizations.add(authorization),
      }),
    [UNAUTHORIZE_SERVICE]: (state: UserState, { payload: { authorization } }) => {
      const found = state.authorizations.find(item => item.uid === authorization.uid)
      if (found) {
        return state.merge({
          authorizations: state.authorizations.delete(found),
        })
      }
      return state
    },
  },
  createUserState(),
)
