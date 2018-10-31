// @flow

import * as React from 'react'
import set from 'lodash/set'
import connect from '~/common/connect'

import db from '~/db'
import { incrementNonce } from '~/redux/songs'
import { normalizeArtist } from '~/parser'

import input from '~/less/input.less'
import button from '~/less/button.less'

import Popup from './Popup'

function validateField(field: string, fields: Object, song: Object) {
  if (field === 'artists') {
    return (fields[field] === '' || fields[field].replace(/\s/g, '') === '') && !song.meta.artists_original
  }
  return (fields[field] === '' || fields[field].replace(/\s/g, '') === '') && !song.meta[field]
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
  ref: ?HTMLInputElement = null

  componentDidMount() {
    if (this.ref) {
      this.ref.focus()
    }
    document.addEventListener('keydown', this.handleKeyPress)
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyPress)
  }

  handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      this.saveSongInfo()
    }
  }

  handleChange = (event: SyntheticInputEvent<HTMLInputElement>) => {
    event.persist()
    this.setState(state => set(state, event.target.name, event.target.value))
  }

  handleBlur = (field: string) => (event: SyntheticInputEvent<HTMLInputElement>) => {
    event.preventDefault()
    const { touched } = this.state
    this.setState({
      touched: { ...touched, [field]: true },
    })
  }

  saveSongInfo = () => {
    const { fields } = this.state
    const { song, handleClose, incrementNonce: incrementNonceProp } = this.props

    db.songs.update(song.id, {
      'meta.name': fields.name !== '' ? fields.name.trim() : song.meta.name,
      'meta.album': fields.album !== '' ? fields.album.trim() : song.meta.album,
      'meta.genre': fields.genre !== '' ? fields.genre.trim().split(',') : song.meta.genre,
      'meta.artists_original':
        fields.artists !== '' ? normalizeArtist(fields.artists.trim().split(',')) : song.meta.artists_original,
    })
    incrementNonceProp()
    handleClose()
  }

  render() {
    const { fields, touched } = this.state
    const { song, handleClose } = this.props

    const errors = validate(fields, song)
    const isDisabled = Object.keys(errors).some(x => errors[x])

    const shouldMarkError = field => {
      const hasError = errors[field]
      const shouldShow = touched[field]

      return hasError ? shouldShow : false
    }

    return (
      <Popup title="Edit Song" handleClose={handleClose}>
        <label htmlFor="name">
          Name
          <input
            type="text"
            ref={i => {
              this.ref = i
            }}
            name="fields.name"
            value={fields.name}
            onChange={this.handleChange}
            onBlur={this.handleBlur('name')}
            placeholder={song.meta && song.meta.name}
            className={`${input.input} ${input.input_popup} ${shouldMarkError('name') ? 'error' : ''}`}
          />
        </label>
        <label htmlFor="album">
          Album
          <input
            type="text"
            name="fields.album"
            value={fields.album}
            onChange={this.handleChange}
            onBlur={this.handleBlur('album')}
            placeholder={song.meta && song.meta.album}
            className={`${input.input} ${input.input_popup} ${shouldMarkError('album') ? 'error' : ''}`}
          />
        </label>
        <label htmlFor="genre">
          Genre
          <input
            type="text"
            name="fields.genre"
            value={fields.genre}
            onChange={this.handleChange}
            onBlur={this.handleBlur('genre')}
            placeholder={song.meta && song.meta.genre}
            className={`${input.input} ${input.input_popup} ${shouldMarkError('genre') ? 'error' : ''}`}
          />
        </label>
        <label htmlFor="artists">
          Artists
          <input
            type="text"
            name="fields.artists"
            value={fields.artists}
            onChange={this.handleChange}
            onBlur={this.handleBlur('artists')}
            placeholder={song.meta && song.meta.artists_original}
            className={`${input.input} ${input.input_popup} ${shouldMarkError('artists') ? 'error' : ''}`}
          />
        </label>
        <button
          type="submit"
          disabled={isDisabled}
          onClick={this.saveSongInfo}
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
)(EditSong)
