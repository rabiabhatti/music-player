// @flow

import React from 'react'
import pMap from 'p-map'
import { compose } from 'recompose'

import db from '~/db'
import { incrementNonce } from '~/redux/songs'
import type { UserAuthorization } from '~/redux/user'

import services from '~/services'
import * as parser from '~/parser'
import connect from '../common/connect'

type Props = {|
  authorizations: Array<UserAuthorization>,
  incrementNonce: () => void,
|}
type State = {||}

class Downloader extends React.Component<Props, State> {
  async componentDidMount() {
    const songs = await db.songs
      .where('state')
      .equals('pending')
      .toArray()
    await pMap(songs, async song => {
      const authorization = this.props.authorizations.find(auth => auth.uid === song.sourceUid)
      if (!authorization) {
        console.warn('Authorization not found for song', song)
        return
      }
      const service = services.find(item => item.name === authorization.service)
      if (!service) {
        console.warn('Service not found for authorization', authorization)
        return
      }
      const response = await service.getFile(authorization, await song.sourceId)
      const { duration, meta, artwork } = await parser.parse(song, response)

      await db.songs.update(song.id, {
        duration,
        meta,
        artwork,
        state: 'downloaded',
      })
      this.props.incrementNonce()
    })
  }

  render() {
    return <div />
  }
}

export default compose(
  connect(
    state => ({ authorizations: state.user.authorizations.toArray() }),
    { incrementNonce },
  ),
)(Downloader)
