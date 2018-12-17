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
    const { recentlyPlayed } = this.props
    this.fetchSongs(recentlyPlayed)
  }

  componentDidUpdate(prevProps) {
    const { nonce, recentlyPlayed } = this.props
    if (prevProps.nonce !== nonce) this.fetchSongs(recentlyPlayed)
    if (!eq(recentlyPlayed, prevProps.recentlyPlayed)) {
      this.timeoutID = setTimeout(() => {
        this.fetchSongs(recentlyPlayed)
      }, 10000)
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timeoutID)
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

  timeoutID: TimeoutID

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
