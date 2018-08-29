// @flow

import * as React from 'react'
import connect from '~/common/connect'

import db from '~/db'
import { incrementNonce } from '~/redux/songs'

import Popup from './Popup'

type Props = {|
  playlist: {|
    name: string,
    id: number,
    songsIds: Array<number>,
  |},
  handleClose: () => void,
  incrementNonce: () => void,
|}
type State = {|
  name: string,
|}

class EditPlaylist extends React.Component<Props, State> {
  state = {
    name: '',
  }

  handleChange = (event: SyntheticInputEvent<HTMLInputElement>) => {
    this.setState({ name: event.target.name })
  }

  savePlaylist = () => {
    const playList = this.props.playlist
    db.playlists.update(playList.id, {
      name: this.state.name,
    })
    this.props.incrementNonce()
    this.props.handleClose()
  }

  render() {
    const { name } = this.state
    const { playlist, handleClose } = this.props

    const enable = name !== '' && name.replace(/\s/g, '') !== ''

    return (
      <Popup handleClose={handleClose}>
        <input
          type="text"
          value={name}
          name="fields.name"
          onInput={this.handleChange}
          placeholder={playlist.name}
          className={!enable ? 'error' : ''}
        />
        <button className="btn-blue-border" onClick={this.savePlaylist} disabled={!enable}>
          Save
        </button>
      </Popup>
    )
  }
}

export default connect(
  null,
  { incrementNonce },
)(EditPlaylist)
