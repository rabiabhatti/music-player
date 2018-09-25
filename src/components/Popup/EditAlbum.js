// @flow

import * as React from 'react'
import set from 'lodash/set'
import connect from '~/common/connect'

import db from '~/db'
import { incrementNonce } from '~/redux/songs'

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
  componentDidMount() {
    this.getInfo()
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
    this.setState(state => set(state, event.target.name, event.target.value.trim()))
  }

  saveAlbumInfo = () => {
    const { songs, handleClose, incrementNonce: incrementNonceProp } = this.props
    const { name, year } = this.state
    Promise.all(
      songs.map(async id => {
        const song = await db.songs.get(id)
        db.songs.update(song.id, {
          'meta.album': name !== '' ? name : song.meta.album,
          'meta.year': year !== '' ? parseInt(year, 10) : song.meta.year,
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
      <Popup handleClose={handleClose}>
        <label htmlFor="name">
          Name
          <input type="text" id="name" name="name" value={name} placeholder={name} onChange={this.handleChange} />
        </label>
        <label htmlFor="year">
          Year
          <input type="text" id="name" name="year" value={year} placeholder={year} onChange={this.handleChange} />
        </label>
        <button type="submit" className="btn-blue-border" onClick={this.saveAlbumInfo} disabled={!enable}>
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
