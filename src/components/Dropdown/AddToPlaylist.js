// @flow

import * as React from 'react'
import connect from '~/common/connect'

import db from '~/db'
import { addSongsToPlaylist } from '~/common/songs'
import CreateNewPlaylist from '~/components/Popup/CreateNewPlaylist'

type Props = {|
  nonce: number,
  songsIds: Array<number>,
|}
type State = {|
  playlists: Array<Object> | null,
  showCreatePlaylistModal: boolean,
|}

class AddToPlaylist extends React.Component<Props, State> {
  state = {
    playlists: null,
    showCreatePlaylistModal: false,
  }

  componentDidMount() {
    this.fetchPlaylists()
  }

  componentDidUpdate(prevProps) {
    const { nonce } = this.props
    if (prevProps.nonce !== nonce) {
      this.fetchPlaylists()
    }
  }

  fetchPlaylists = async () => {
    const playlists = await db.playlists.toArray()
    this.setState({ playlists })
  }

  render() {
    const { songsIds } = this.props
    const { showCreatePlaylistModal, playlists } = this.state

    if (showCreatePlaylistModal) {
      return <CreateNewPlaylist handleClose={() => this.setState({ showCreatePlaylistModal: false })} songsIds={songsIds} />
    }

    return (
      <div className="sub-dropdown-trigger">
        <button type="button" className="btn-dull space-between" onClick={e => e.preventDefault()}>
          Add to Playlist
          <i className="material-icons">add</i>
        </button>
        <div className="sub-dropdown dropdown-content hidden">
          <button type="button" onClick={() => this.setState({ showCreatePlaylistModal: true })}>
            New Playlist
          </button>
          {playlists &&
            playlists.map(playList => (
              <button type="button" key={playList.id} onClick={() => addSongsToPlaylist(songsIds, playList.id)}>
                {playList.name}
              </button>
            ))}
        </div>
      </div>
    )
  }
}

export default connect(
  ({ songs }) => ({
    nonce: songs.nonce,
  }),
  null,
)(AddToPlaylist)
