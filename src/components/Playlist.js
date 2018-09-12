// @flow

import * as React from 'react'
import { connect } from 'react-redux'

import db from '~/db'

import '~/css/songs.css'
import '~/css/table.css'
import SongsTable from './SongsTable'
import ReplacementText from './ReplacementText'

type Props = {|
  nonce: number,
  route: {|
    name: string,
    id: number,
  |},
|}
type State = {|
  playlist: Object,
  songs: Array<Object>,
|}

class Playlist extends React.Component<Props, State> {
  state = { playlist: {}, songs: [] }

  componentDidMount() {
    this.getPlaylist(this.props.route.id)
  }

  componentDidUpdate(prevProps) {
    if (prevProps.nonce !== this.props.nonce || prevProps.route.id !== this.props.route.id) {
      this.getPlaylist(this.props.route.id)
    }
  }

  getPlaylist = async (playlistId: number) => {
    this.setState({ songs: [] })
    const playlist = await db.playlists.get(playlistId)
    if (playlist.songs.length) {
      playlist.songs.forEach(async id => {
        const song = await db.songs.get(id)
        if (song) {
          this.setState(prevState => ({
            playlist,
            songs: [...prevState.songs, song],
          }))
        }
      })
    }
  }

  render() {
    const { songs, playlist } = this.state

    return (
      <div className="section-songs bound">
        {songs.length ? <SongsTable title={playlist.name} songs={songs} /> : <ReplacementText />}
      </div>
    )
  }
}

export default connect(
  ({ router, songs }) => ({
    route: router.route,
    nonce: songs.nonce,
  }),
  null,
)(Playlist)
