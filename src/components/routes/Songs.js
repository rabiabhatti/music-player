// @flow

import * as React from 'react'
import connect from '~/common/connect'

import db from '~/db'

import SongsTable from '../SongsTable'
import EmptyMusicText from '../EmptyMusicText'

type Props = {|
  nonce: number,
|}
type State = {|
  songs: Array<Object>,
|}

class Songs extends React.Component<Props, State> {
  state = { songs: [] }

  componentDidMount() {
    this.fetchSongs()
  }

  componentDidUpdate(prevProps) {
    const { nonce } = this.props
    if (prevProps.nonce !== nonce) {
      this.fetchSongs()
    }
  }

  fetchSongs() {
    db.songs
      .where('state')
      .equals('downloaded')
      .toArray()
      .then(songs => {
        this.setState({ songs })
      })
  }

  render() {
    const { songs } = this.state

    return songs.length ? <SongsTable title="Songs" songs={songs} /> : <EmptyMusicText />
  }
}

export default connect(
  ({ songs }) => ({
    nonce: songs.nonce,
  }),
  null,
)(Songs)
