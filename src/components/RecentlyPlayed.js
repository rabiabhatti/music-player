// @flow

import * as React from 'react'
import { connect } from 'react-redux'

import db from '~/db'

import '~/css/songs.css'
import SongsTable from './SongsTable'
import ReplacementText from './ReplacementText'

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
    this.fetchSongs(this.props.recentlyPlayed.reverse())
  }

  componentDidUpdate(prevProps) {
    if (prevProps.nonce !== this.props.nonce || prevProps.recentlyPlayed.length !== this.props.recentlyPlayed.length) {
      this.fetchSongs(this.props.recentlyPlayed.reverse())
    }
  }

  fetchSongs(idsArr: Array<number>) {
    this.setState({ songs: [] })
    idsArr.forEach(async id => {
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

    return (
      <div className="section-songs bound">
        {songs.length ? <SongsTable title="Recently Played" songs={songs} /> : <ReplacementText />}
      </div>
    )
  }
}

export default connect(
  ({ songs }) => ({
    nonce: songs.nonce,
    recentlyPlayed: songs.recentlyPlayed,
  }),
  null,
)(RecentlyPlayed)
