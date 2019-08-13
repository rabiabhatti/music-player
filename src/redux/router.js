// @flow

import { NAVIGATE_TO } from '../common/types'

export type RouteName = 'Albums' | 'Artists' | 'Playlist' | 'Genres' | 'Songs' | 'RecentlyPlayed' | 'NewPlaylist'

export type RouterRoute = {
  name: RouteName,
  id: ?number,
}

type RouterState = {|
  route: RouterRoute
|}

type ActionState = {|
  type: string,
  route: RouterRoute
|}

const INITIAL_STATE: RouterState = {
  route: {
    name: 'Songs',
    id: null,
  },
}

export default (state: RouterState = INITIAL_STATE, action: ActionState) => {
  switch (action.type) {
    case NAVIGATE_TO:
      return {...state, route: action.route}
    default:
      return state;
  }
}


