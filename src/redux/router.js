// @flow

import { createAction, handleActions } from 'redux-actions'
import { Record, type RecordOf, type RecordFactory } from 'immutable'

const NAVIGATE_TO = 'ROUTES/NAVIGATE_TO'

export type RouteName = 'Albums' | 'Artists' | 'Playlist' | 'Genres' | 'Songs' | 'RecentlyPlayed'

export type RouterRoute = {
  name: RouteName,
  id: ?number,
}
export type RouterStateFields = {|
  route: RouterRoute,
|}

export type RouterState = RecordOf<RouterStateFields>
const createRouterState: RecordFactory<RouterStateFields> = Record({
  route: {
    name: 'Songs',
    id: null,
  },
})
export const navigateTo = createAction(NAVIGATE_TO, (payload: { name: RouteName, id: ?number }) => payload)

export default handleActions(
  {
    [NAVIGATE_TO]: (state: RouterState, { payload: { name, id } }) =>
      state.merge({
        route: { name, id },
      }),
  },
  createRouterState(),
)
