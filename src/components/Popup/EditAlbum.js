// @flow

import * as React from 'react'
import set from 'lodash/set'
import connect from '~/common/connect'

import db from '~/db'
import { incrementNonce } from '~/redux/songs'

import Popup from './Popup'

type Props = {|
  album: Array<number>,
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
    const localAlbum = this.props.album
    const dbSong = await db.songs.get(localAlbum[0])

    this.setState({
      name: !dbSong.meta.album ? 'Unkown' : dbSong.meta.album,
      year: !dbSong.meta.year ? 'Unkown' : dbSong.meta.year.toString(),
    })
  }

  handleChange = (event: SyntheticInputEvent<HTMLInputElement>) => {
    event.persist()
    this.setState(state => set(state, event.target.name, event.target.value))
  }

  saveAlbumInfo = () => {
    const { name, year } = this.state

    this.props.album.forEach(async id => {
      const song = await db.songs.get(id)
      db.songs.update(song.id, {
        'meta.album': name !== '' ? name : song.meta.album,
        'meta.year': year !== '' ? parseInt(year, 10) : song.meta.year,
      })
    })

    this.props.incrementNonce()
    this.props.handleClose()
  }

  render() {
    const { name, year } = this.state
    const { handleClose } = this.props

    const enable = name !== '' && year !== '' && name.replace(/\s/g, '') !== '' && year.replace(/\s/g, '') !== ''

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
        <button className="btn-blue-border" onClick={this.saveAlbumInfo} disabled={!enable}>
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
