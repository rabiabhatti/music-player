// @flow

import type { UserState } from './user'
import type { SongsState } from './songs'

type ReduxState = {|
  user: UserState,
  songs: SongsState,
|}

export type { ReduxState, UserState, SongsState }
