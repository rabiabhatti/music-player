// @flow

import * as React from 'react'
import connect from '~/common/connect'

import { incrementNonce, playLater } from '~/redux/songs'
import { deleteSongsFromLibrary } from '~/common/songs'

import Dropdown from './Dropdown'
import AddToPlaylist from './AddToPlaylist'

type Props = {|
  songsIds: Array<number>,
  handleClose: () => void,
  incrementNonce: () => void,
  playLater: typeof playLater,
|}
type State = {||}

class ContentCardDropdown extends React.Component<Props, State> {
  deleteSong = (e: SyntheticEvent<HTMLButtonElement>, ids: Array<number>) => {
    const { incrementNonce: incrementNonceProp } = this.props
    deleteSongsFromLibrary(ids)
    incrementNonceProp()
  }

  render() {
    const { handleClose, songsIds, playLater: playLaterProp } = this.props

    return (
      <Dropdown handleClose={handleClose}>
        <AddToPlaylist songsIds={songsIds} />
        <button type="button" onClick={e => playLaterProp(e, songsIds)}>
          Play Later
        </button>
        <button type="button" onClick={e => this.deleteSong(e, songsIds)}>
          Delete from Library
        </button>
      </Dropdown>
    )
  }
}

export default connect(
  null,
  { incrementNonce, playLater },
)(ContentCardDropdown)
