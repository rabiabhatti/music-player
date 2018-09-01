// @flow

import * as React from 'react'
import set from 'lodash/set'
import connect from '~/common/connect'

import db from '~/db'
import { incrementNonce } from '~/redux/songs'
import { normalizeArtist } from '~/parser'

import Popup from './Popup'

function validateField(field: string, fields: Object, song: Object) {
  if (field === 'artists') {
    return (fields[field] === '' || fields[field].replace(/\s/g, '') === '') && song.meta.artists_original === undefined
  }
  return (fields[field] === '' || fields[field].replace(/\s/g, '') === '') && song.meta[field] === undefined
}

function validate(fields: Object, song: Object) {
  return {
    name: validateField('name', fields, song),
    album: validateField('album', fields, song),
    genre: validateField('genre', fields, song),
    artists: validateField('artists', fields, song),
  }
}

type Props = {|
  song: Object,
  handleClose: () => void,
  incrementNonce: () => void,
|}
type State = {|
  fields: {|
    name: string,
    album: string,
    genre: string,
    artists: string,
  |},
  touched: {|
    name: boolean,
    album: boolean,
    genre: boolean,
    artists: boolean,
  |},
|}

class EditSong extends React.Component<Props, State> {
  state = {
    fields: {
      name: '',
      album: '',
      genre: '',
      artists: '',
    },
    touched: {
      name: false,
      album: false,
      genre: false,
      artists: false,
    },
  }

  handleChange = (event: SyntheticInputEvent<HTMLInputElement>) => {
    event.persist()
    this.setState(state => set(state, event.target.name, event.target.value))
  }

  handleBlur = (field: string) => (event: SyntheticInputEvent<HTMLInputElement>) => {
    event.preventDefault()
    this.setState({
      touched: { ...this.state.touched, [field]: true },
    })
  }

  saveSongInfo = () => {
    const info = this.state.fields
    const localGenre = info.genre.split(',')
    const localArtists = info.artists.split(',')
    const localSong = this.props.song.meta

    db.songs.update(this.props.song.id, {
      'meta.name': info.name !== '' ? info.name : localSong.name,
      'meta.album': info.album !== '' ? info.album : localSong.album,
      'meta.genre': info.genre !== '' ? localGenre : localSong.genre,
      'meta.artists': info.artists !== '' ? normalizeArtist(localArtists) : localSong.artists,
      'meta.artists_original': info.artists !== '' ? localArtists : localSong.artists_original,
      'meta.album_artists': info.artists !== '' ? normalizeArtist(localArtists) : localSong.album_artists,
      'meta.album_artists_original': info.artists !== '' ? localArtists : localSong.album_artists_original,
    })
    this.props.incrementNonce()
    this.props.handleClose()
  }

  render() {
    const { fields } = this.state
    const { song, handleClose } = this.props

    const errors = validate(fields, song)
    const isDisabled = Object.keys(errors).some(x => errors[x])

    const shouldMarkError = field => {
      const hasError = errors[field]
      const shouldShow = this.state.touched[field]

      return hasError ? shouldShow : false
    }

    return (
      <Popup handleClose={handleClose}>
        <label htmlFor="name">
          Name
          <input
            id="name"
            type="text"
            name="fields.name"
            value={fields.name}
            onChange={this.handleChange}
            onBlur={this.handleBlur('name')}
            placeholder={song.meta && song.meta.name}
            className={shouldMarkError('name') ? 'error' : ''}
          />
        </label>
        <label htmlFor="album">
          Album
          <input
            id="album"
            type="text"
            name="fields.album"
            value={fields.album}
            onChange={this.handleChange}
            onBlur={this.handleBlur('album')}
            placeholder={song.meta && song.meta.album}
            className={shouldMarkError('album') ? 'error' : ''}
          />
        </label>
        <label htmlFor="genre">
          Genre
          <input
            id="genre"
            type="text"
            name="fields.genre"
            value={fields.genre}
            onChange={this.handleChange}
            onBlur={this.handleBlur('genre')}
            placeholder={song.meta && song.meta.genre}
            className={shouldMarkError('genre') ? 'error' : ''}
          />
        </label>
        <label htmlFor="artists">
          Artists
          <input
            type="text"
            id="artists"
            name="fields.artists"
            value={fields.artists}
            onChange={this.handleChange}
            onBlur={this.handleBlur('artists')}
            placeholder={song.meta && song.meta.artists_original}
            className={shouldMarkError('artists') ? 'error' : ''}
          />
        </label>
        <button className="btn-blue-border" onClick={this.saveSongInfo} disabled={isDisabled}>
          Save
        </button>
      </Popup>
    )
  }
}

export default connect(
  null,
  { incrementNonce },
)(EditSong)
