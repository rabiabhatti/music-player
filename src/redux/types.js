// @flow

import type { UserState } from './user'
import type { SongsState } from './songs'
import type { RouterState } from './router'

type ReduxState = {|
  user: UserState,
  songs: SongsState,
  router: RouterState,
|}

export type { ReduxState, UserState, SongsState, RouterState }
