// @flow

import * as React from 'react'
import { connect } from 'react-redux'

import db from '~/db'

import SongsTable from '../SongsTable'
import EmptyMusicText from '../EmptyMusicText'

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
    const { route } = this.props
    this.getPlaylist(route.id)
  }

  componentDidUpdate(prevProps) {
    const { nonce, route } = this.props
    if (prevProps.nonce !== nonce || prevProps.route.id !== route.id) this.getPlaylist(route.id)
  }

  getPlaylist = async (playlistId: number) => {
    this.setState({ songs: [] })
    const playlist = await db.playlists.get(playlistId)
    if (playlist.songs && playlist.songs.length) {
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

    return songs.length ? <SongsTable title={playlist.name} songs={songs} playlist={playlist} /> : <EmptyMusicText />
  }
}

export default connect(
  ({ router, songs }) => ({
    route: router.route,
    nonce: songs.nonce,
  }),
  null,
)(Playlist)
