// @flow

import React from 'react'
import { compose } from 'recompose'

import db from '~/db'
import { incrementNonce } from '~/redux/songs'
import type { UserAuthorization } from '~/redux/user'

import services from '~/services'
import * as parser from '~/parser'
import connect from '../common/connect'

type Props = {|
  nonce: number,
  authorizations: Array<UserAuthorization>,
  incrementNonce: () => void,
|}
type State = {||}

class Downloader extends React.Component<Props, State> {
  componentDidMount() {
    // Convert existing "downloading" state songs to "pending"
    db.songs
      .where('state')
      .equals('downloading')
      .modify({ state: 'pending' })
    this.startProcessingPendingSongs()
  }
  componentWillReceiveProps(newProps) {
    if (this.props.nonce !== newProps.nonce) {
      this.startProcessingPendingSongs()
    }
  }

  lastSong = null
  downloading = false

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
    const [song = null] = await db.songs
      .where('state')
      .equals('pending')
      .limit(1)
      .toArray()

    this.lastSong = song
    if (!song) {
      console.debug('[Downloader] No song to download, going back to sleep')
      return
    }

    const authorization = this.props.authorizations.find(auth => auth.uid === song.sourceUid)
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

    this.props.incrementNonce()
  }

  render() {
    return <div />
  }
}

export default compose(
  connect(
    state => ({ authorizations: state.user.authorizations.toArray(), nonce: state.songs.nonce }),
    { incrementNonce },
  ),
)(Downloader)
