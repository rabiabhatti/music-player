// @flow

import type { UserState } from './user'
import type { SongsState } from './songs'
import type { ComponentsState } from './components'

type ReduxState = {|
  user: UserState,
  songs: SongsState,
  components: ComponentsState,
|}

export type { ReduxState, UserState, SongsState, ComponentsState }
