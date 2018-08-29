// @flow

import * as React from 'react'
import set from 'lodash/set'
import connect from '~/common/connect'

import db from '~/db'
import { incrementNonce } from '~/redux/songs'

import Popup from './Popup'

function validateField(field: string, fields: Object, song: Object) {
  return fields[field] === '' || (fields[field].replace(/\s/g, '') === '' && song.meta[field] === undefined)
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
    db.songs.update(this.props.song.id, {
      album: info.album,
      'meta.name': info.name,
      'meta.album': info.album,
      'meta.genre': localGenre,
      'meta.artists': localArtists,
      album_artists: localArtists,
      'meta.artists_original': localArtists,
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
        <input
          type="text"
          name="fields.name"
          value={fields.name}
          onChange={this.handleChange}
          onBlur={this.handleBlur('name')}
          className={shouldMarkError('name') ? 'error' : ''}
          placeholder={song.meta && song.meta.name ? song.meta.name : 'Name'}
        />
        <input
          type="text"
          name="fields.album"
          value={fields.album}
          onChange={this.handleChange}
          onBlur={this.handleBlur('album')}
          className={shouldMarkError('album') ? 'error' : ''}
          placeholder={song.meta && song.meta.album ? song.meta.album : 'Album'}
        />
        <input
          type="text"
          name="fields.genre"
          value={fields.genre}
          onChange={this.handleChange}
          onBlur={this.handleBlur('genre')}
          className={shouldMarkError('genre') ? 'error' : ''}
          placeholder={song.meta && song.meta.genre ? song.meta.genre : 'Genre'}
        />
        <input
          type="text"
          name="fields.artists"
          value={fields.artists}
          onChange={this.handleChange}
          onBlur={this.handleBlur('artists')}
          className={shouldMarkError('artists') ? 'error' : ''}
          placeholder={song.meta && song.meta.artists ? song.meta.artists : 'Artists'}
        />
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
