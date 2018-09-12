// @flow

import * as React from 'react'
import { connect } from 'react-redux'

import '~/css/songs.css'
import '~/css/table.css'

import db from '~/db'

import SongsTable from './SongsTable'
import ReplacementText from './ReplacementText'

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
    if (prevProps.nonce !== this.props.nonce) {
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

    return (
      <div className="section-songs bound">
        {songs.length ? <SongsTable title="Songs" songs={songs} /> : <ReplacementText />}
      </div>
    )
  }
}

export default connect(
  ({ songs }) => ({
    nonce: songs.nonce,
  }),
  null,
)(Songs)
