// @flow

import * as React from 'react'
import connect from '~/common/connect'

import { incrementNonce, playLater } from '~/redux/songs'
import { deleteSongsFromLibrary } from '~/common/songs'

import flex from '~/less/flex.less'
import button from '~/less/button.less'

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
  deleteSong = (ids: Array<number>) => {
    const { incrementNonce: incrementNonceProp } = this.props
    deleteSongsFromLibrary(ids)
    incrementNonceProp()
  }

  render() {
    const { handleClose, songsIds, playLater: playLaterProp } = this.props

    return (
      <Dropdown handleClose={handleClose}>
        <AddToPlaylist songsIds={songsIds} />
        <button className={`${button.btn} ${flex.justify_start}`} type="button" onClick={() => playLaterProp(songsIds)}>
          <i className="material-icons">watch_later</i>
          Play Later
        </button>
        <button className={`${button.btn} ${flex.justify_start}`} type="button" onClick={() => this.deleteSong(songsIds)}>
          <i className="material-icons">delete</i>
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
