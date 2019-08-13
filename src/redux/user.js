// @flow
import type { ServiceName } from '~/types'
import { AUTHORIZE_SERVICE, UNAUTHORIZE_SERVICE } from '../common/types'

export type UserAuthorization = {|
    uid: string,
    meta: Object,
    email: string,
    user_name: string,
    service: ServiceName,
|}

type UserState = {|
    authorizations: Array<UserAuthorization>
|}

type ActionState = {|
    type: string,
    authorization: UserAuthorization
|}

const INITIAL_STATE: UserState = {
    authorizations: [],
}

export default (state: UserState = INITIAL_STATE, action: ActionState) => {
    switch (action.type) {
        case AUTHORIZE_SERVICE:
            return {...state, authorizations: [...state.authorizations, action.authorization]}
        case UNAUTHORIZE_SERVICE: {
            const authorizationsCopy: Array<UserAuthorization> = state.authorizations.slice()
            const found = state.authorizations.find(item => item.uid === action.authorization.uid)
            if (found) {
                const index = state.authorizations.indexOf(found)
                authorizationsCopy.splice(index, 1)
            }
            return {...state, authorizations: authorizationsCopy}
        }
        default:
            return state;
    }
}