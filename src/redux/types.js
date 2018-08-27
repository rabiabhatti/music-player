// @flow

import type { UserState } from './user'
import type { PopupState } from './popup'
import type { SongsState } from './songs'
import type { RouterState } from './router'

type ReduxState = {|
  user: UserState,
  popup: PopupState,
  songs: SongsState,
  router: RouterState,
|}

export type { ReduxState, UserState, SongsState, RouterState, PopupState }
