// @flow

import * as React from 'react'
import connect from '~/common/connect'

import db from '~/db'
import { incrementNonce } from '~/redux/songs'

import input from '~/styles/input.less'
import button from '~/styles/button.less'

import Popup from './Popup'

type Props = {|
  id: number,
  name: string,
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
  ref: ?HTMLInputElement = null

  componentDidMount() {
    if (this.ref) this.ref.focus()
    document.addEventListener('keydown', this.handleKeyPress)
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyPress)
  }

  handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Enter') this.savePlaylist()
  }

  handleChange = (event: SyntheticInputEvent<HTMLInputElement>) => {
    this.setState({ name: event.target.value })
  }

  savePlaylist = () => {
    const { name } = this.state
    const { name: playlistName, id, handleClose, incrementNonce: incrementNonceProp } = this.props
    db.playlists.update(id, {
      name: name !== '' ? name.trim() : playlistName,
    })
    incrementNonceProp()
    handleClose()
  }

  render() {
    const { name } = this.state
    const { name: playlistName, handleClose } = this.props

    const enable = name !== ''

    return (
      <Popup title="Edit Playlist" handleClose={handleClose}>
        <label htmlFor="name">
          Name
          <input
            type="text"
            name="name"
            ref={i => {
              this.ref = i
            }}
            value={name}
            placeholder={playlistName}
            onInput={this.handleChange}
            className={`${input.input} ${input.input_popup}`}
          />
        </label>
        <button
          type="submit"
          disabled={!enable}
          onClick={this.savePlaylist}
          className={`${button.btn} ${button.btn_blue_border}`}
        >
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
