// @flow

import * as React from 'react'
import set from 'lodash/set'
import connect from '~/common/connect'

import db from '~/db'
import { incrementNonce } from '~/redux/songs'

import input from '~/less/input.less'
import button from '~/less/button.less'

import Popup from './Popup'

type Props = {|
  songs: Array<number>,
  handleClose: () => void,
  incrementNonce: () => void,
|}
type State = {|
  name: string,
  year: string,
|}

class EditAlbum extends React.Component<Props, State> {
  state = {
    name: '',
    year: '',
  }
  ref: ?HTMLInputElement = null

  componentDidMount() {
    this.getInfo()
    if (this.ref) this.ref.focus()
    document.addEventListener('keydown', this.handleKeyPress)
  }
  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyPress)
  }

  handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Enter') this.saveAlbumInfo()
  }

  getInfo = async () => {
    const { songs } = this.props
    const song = await db.songs.get(songs[0])

    this.setState({
      name: !song.meta.album ? 'Unkown' : song.meta.album,
      year: !song.meta.year ? 'Unkown' : song.meta.year.toString(),
    })
  }

  handleChange = (event: SyntheticInputEvent<HTMLInputElement>) => {
    event.persist()
    this.setState(state => set(state, event.target.name, event.target.value))
  }

  saveAlbumInfo = () => {
    const { songs, handleClose, incrementNonce: incrementNonceProp } = this.props
    const { name, year } = this.state
    Promise.all(
      songs.map(async id => {
        const song = await db.songs.get(id)
        db.songs.update(song.id, {
          'meta.album': name !== '' ? name.trim() : song.meta.album,
          'meta.year': year !== '' ? parseInt(year.trim(), 10) : song.meta.year,
        })
      }),
    ).then(() => {
      incrementNonceProp()
      handleClose()
    })
  }

  render() {
    const { name, year } = this.state
    const { handleClose } = this.props

    const enable = name !== '' && year !== ''

    return (
      <Popup title="Edit Album" handleClose={handleClose}>
        <label htmlFor="name">
          Name
          <input
            type="text"
            name="name"
            ref={i => {
              this.ref = i
            }}
            value={name}
            placeholder={name}
            onChange={this.handleChange}
            className={`${input.input} ${input.input_popup}`}
          />
        </label>
        <label htmlFor="year">
          Year
          <input
            type="text"
            name="year"
            value={year}
            placeholder={year}
            onInput={this.handleChange}
            className={`${input.input} ${input.input_popup}`}
          />
        </label>
        <button
          type="submit"
          disabled={!enable}
          onClick={this.saveAlbumInfo}
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
)(EditAlbum)
