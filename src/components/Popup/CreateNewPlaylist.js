// @flow

import * as React from 'react'
import connect from '~/common/connect'

import db from '~/db'
import { incrementNonce } from '~/redux/songs'

import input from '~/less/input.less'
import button from '~/less/button.less'

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
    const { name } = this.state
    const { songsIds, handleClose, incrementNonce: incrementNonceProp } = this.props

    db.playlists.add({ name, songs: songsIds })
    incrementNonceProp()
    handleClose()
  }

  render() {
    const { name } = this.state
    const { handleClose } = this.props

    const enable = name !== ''

    return (
      <Popup handleClose={handleClose}>
        <input
          type="text"
          name="name"
          value={name}
          placeholder="Choose name"
          onFocus={e => {
            e.target.placeholder = ''
          }}
          onBlur={e => {
            e.target.placeholder = 'Choose name'
          }}
          onInput={this.handleChange}
          className={`${input.input} ${input.input_popup}`}
        />
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
)(CreateNewPlaylist)
