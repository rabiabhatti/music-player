// @flow

import * as React from 'react'
import connect from '~/common/connect'

import db from '~/db'
import { incrementNonce } from '~/redux/songs'

import Popup from './Popup'

type Props = {|
  songsIds?: Array<number>,
  handleClose: () => void,
  incrementNonce: () => void,
|}
type State = {|
  name: string,
|}

class CreateNewPlaylist extends React.Component<Props, State> {
  state = {
    name: '',
  }

  handleChange = (event: SyntheticInputEvent<HTMLInputElement>) => {
    this.setState({ name: event.target.value.trim() })
  }

  savePlaylist = () => {
    db.playlists.add({ name: this.state.name, songs: this.props.songsIds })
    this.props.incrementNonce()
    this.props.handleClose()
  }

  render() {
    const { name } = this.state
    const { handleClose } = this.props

    const enable = name !== ''

    return (
      <Popup handleClose={handleClose}>
        <input type="text" name="name" value={name} onInput={this.handleChange} placeholder="Choose name" />
        <button className="btn-blue-border" onClick={this.savePlaylist} disabled={!enable}>
          Save
        </button>
      </Popup>
    )
  }
}

export default connect(null, { incrementNonce })(CreateNewPlaylist)
