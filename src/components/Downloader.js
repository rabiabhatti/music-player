// @flow

import React from 'react'
import { compose } from 'recompose'

import db from '~/db'
import { incrementNonce } from '~/redux/songs'
import type { UserAuthorization } from '~/redux/user'

import services from '~/services'
import * as parser from '~/parser'
import { connect } from 'react-redux'
import DownloadingSnackbar from '~/components/Snackbar/DownloadingSnackbar'

type Props = {|
  nonce: number,
  authorizations: Array<UserAuthorization>,
  incrementNonce: () => void,
|}
type State = {|
  downloaded: boolean,
  downloading: boolean,
  pendingSongsLength: number,
  showDownloadingSnackbarModal: boolean,
|}

class Downloader extends React.Component<Props, State> {
  lastSong = null
  downloading = false

  state = {
    downloaded: false,
    downloading: false,
    pendingSongsLength: 0,
    showDownloadingSnackbarModal: false,
  }

  componentDidMount() {
    db.songs
      .where('state')
      .equals('downloading')
      .modify({ state: 'pending' })
    this.startProcessingPendingSongs()
  }

  componentDidUpdate(prevProps) {
    const { nonce } = this.props
    if (prevProps.nonce !== nonce) this.startProcessingPendingSongs()
  }

  startProcessingPendingSongs() {
    if (this.downloading) {
      return
    }
    this.downloading = true
    this.processPendingSongs()
      .catch(console.error)
      .then(() => {
        this.downloading = false
        if (this.lastSong) {
          this.startProcessingPendingSongs()
        }
      })
  }
  async processPendingSongs() {
    const { pendingSongsLength } = this.state
    const [song = null] = await db.songs
      .where('state')
      .equals('pending')
      .limit(1)
      .toArray()

    this.lastSong = song
    if (!song) {
      if (pendingSongsLength > 0) {
        this.setState({ downloading: false, downloaded: true, showDownloadingSnackbarModal: true })
      }
      console.debug('[Downloader] No song to download, going back to sleep')
      return
    }

    const { authorizations, incrementNonce: incrementNonceProp } = this.props

    const authorization = authorizations.find(auth => auth.uid === song.sourceUid)
    if (!authorization) {
      await db.songs.update(song.id, {
        state: 'error',
        stateMessage: 'Authorization not found for song',
      })
      return
    }
    const service = services.find(item => item.name === authorization.service)
    if (!service) {
      await db.songs.update(song.id, {
        state: 'error',
        stateMessage: 'Service not found for authorization',
      })
      return
    }
    this.setState({
      downloaded: false,
      downloading: true,
      showDownloadingSnackbarModal: true,
      pendingSongsLength: pendingSongsLength + 1,
    })
    await db.songs.update(song.id, {
      state: 'downloading',
    })

    const response = await service.getFile(authorization, await song.sourceId)
    const { duration, meta, artwork } = await parser.parse(song, response)

    await db.songs.update(song.id, {
      duration,
      meta,
      artwork,
      state: 'downloaded',
    })

    incrementNonceProp()
  }

  render() {
    const { pendingSongsLength, downloading, downloaded, showDownloadingSnackbarModal } = this.state

    if (showDownloadingSnackbarModal && downloading && pendingSongsLength > 0) {
      return (
        <DownloadingSnackbar
          type="downloading"
          text={`Downloading ${pendingSongsLength} ${pendingSongsLength === 1 ? 'file' : 'files'}`}
        />
      )
    }

    if (showDownloadingSnackbarModal && downloaded) {
      return (
        <DownloadingSnackbar
          type="downloaded"
          handleClose={() => this.setState({ showDownloadingSnackbarModal: false })}
          text={`${pendingSongsLength} ${pendingSongsLength === 1 ? 'file' : 'files'} successfully downloaded`}
        />
      )
    }
    return null
  }
}

export default compose(
  connect(
    ({ user, songs }) => ({ authorizations: user.authorizations, nonce: songs.nonce }),
    { incrementNonce },
  ),
)(Downloader)
