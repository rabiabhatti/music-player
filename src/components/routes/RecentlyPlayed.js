// @flow

import * as React from 'react'
import eq from 'lodash/eq'
import connect from '~/common/connect'

import db from '~/db'

import SongsTable from '../SongsTable'
import EmptyMusicText from '../EmptyMusicText'

type Props = {|
  nonce: number,
  recentlyPlayed: Array<number>,
|}
type State = {|
  songs: Array<Object>,
|}

class RecentlyPlayed extends React.Component<Props, State> {
  state = { songs: [] }

  componentDidMount() {
    this.fetchSongs(this.props.recentlyPlayed)
  }

  componentDidUpdate(prevProps) {
    if (prevProps.nonce !== this.props.nonce || !eq(this.props.recentlyPlayed, prevProps.recentlyPlayed)) {
      this.fetchSongs(this.props.recentlyPlayed)
    }
  }

  fetchSongs(ids: Array<number>) {
    this.setState({ songs: [] })
    ids.forEach(async id => {
      const song = await db.songs.get(id)
      if (song) {
        this.setState(prevState => ({
          songs: [...prevState.songs, song],
        }))
      }
    })
  }
  render() {
    const { songs } = this.state

    return songs.length ? <SongsTable title="Recently Played" songs={songs} /> : <EmptyMusicText />
  }
}

export default connect(
  ({ songs }) => ({
    nonce: songs.nonce,
    recentlyPlayed: songs.recentlyPlayed,
  }),
  null,
)(RecentlyPlayed)
