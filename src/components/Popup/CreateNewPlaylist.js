// @flow

import * as React from 'react'
import { connect } from 'react-redux'

import db from '~/db'
import { incrementNonce } from '~/redux/songs'

import input from '~/styles/input.less'
import button from '~/styles/button.less'

import Popup from './Popup'

type Props = {|
  songsIds?: ?Array<number>,
  handleClose: () => void,
  incrementNonce: () => void,
|}
type State = {|
  name: string,
|}

class CreateNewPlaylist extends React.Component<Props, State> {
  static defaultProps = {
    songsIds: null,
  }
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
    const { name } = this.state
    const { handleClose } = this.props
    if (e.key === 'Enter' && name !== '') this.savePlaylist()
    else if (e.key === 'Enter' && name === '') handleClose()
  }

  handleChange = (event: SyntheticInputEvent<HTMLInputElement>) => {
    this.setState({ name: event.target.value })
  }

  savePlaylist = () => {
    const { name } = this.state
    const albumName = name.trim()
    const { songsIds, handleClose, incrementNonce: incrementNonceProp } = this.props

    db.playlists.add({ name: albumName, songs: songsIds })
    incrementNonceProp()
    handleClose()
  }

  render() {
    const { name } = this.state
    const { handleClose } = this.props

    const enable = name !== ''

    return (
      <Popup handleClose={handleClose} title="New Playlist">
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
          ref={i => {
            this.ref = i
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
