// @flow

import { createAction, handleActions } from 'redux-actions'
import { Record, type RecordOf, type RecordFactory } from 'immutable'

const SHOW_POPUP = 'ROUTES/SHOW_POPUP'

export type Popup = {
  show: boolean,
  songsIds: ?Array<number>,
}

export type PopupStateFields = {|
  popup: Popup,
|}

export type PopupState = RecordOf<PopupStateFields>
const createPopupState: RecordFactory<PopupStateFields> = Record({
  popup: {
    show: false,
    songsIds: null,
  }
})

export const showPopup = createAction(SHOW_POPUP, (payload: { show: boolean, songsIds: ? ?Array<number> }) => payload)

export default handleActions(
  {
    [SHOW_POPUP]: (state: PopupState, { payload: { show, songsIds } }) =>
      state.merge({
        popup: { show, songsIds }
      })
  },
  createPopupState(),
)
