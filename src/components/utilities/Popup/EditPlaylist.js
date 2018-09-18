// @flow

import * as React from 'react'
import connect from '~/common/connect'

import db from '~/db'
import { incrementNonce } from '~/redux/songs'

import Popup from './Popup'

type Props = {|
  id: number,
  name: string,
  handleClose: () => void,
  incrementNonce: () => void,
|}
type State = {|
  localName: string,
|}

class EditPlaylist extends React.Component<Props, State> {
  state = {
    localName: '',
  }

  handleChange = (event: SyntheticInputEvent<HTMLInputElement>) => {
    this.setState({ localName: event.target.value })
  }

  savePlaylist = () => {
    const { name, id } = this.props
    db.playlists.update(id, {
      name: this.state.localName !== '' ? this.state.localName : name,
    })
    this.props.incrementNonce()
    this.props.handleClose()
  }

  render() {
    const { localName } = this.state
    const { name, handleClose } = this.props

    const enable = localName !== '' && localName.replace(/\s/g, '') !== ''

    return (
      <Popup handleClose={handleClose}>
        <label htmlFor="name">
          Name
          <input id="name" type="text" name="name" value={localName} onInput={this.handleChange} placeholder={name} />
        </label>
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
