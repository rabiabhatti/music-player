// @flow

import * as React from 'react'
import connect from '~/common/connect'

import db from '~/db'
import { addSongsToPlaylist } from '~/common/songs'
import CreateNewPlaylist from '~/components/Popup/CreateNewPlaylist'

import flex from '~/less/flex.less'
import button from '~/less/button.less'
import dropdown from '~/less/dropdown.less'

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
      <div className={`${dropdown.sub_dropdown_trigger}`}>
        <button type="button" className={`${button.btn} ${flex.space_between} ${flex.justify_start}`} onClick={e => e.preventDefault()}>
          <i className="material-icons">add</i>
          Add to Playlist
        </button>
        <div className={`${dropdown.sub_dropdown} ${dropdown.dropdown_content} hidden`}>
          <button className={`${button.btn} ${flex.justify_start}`} type="button" onClick={() => this.setState({ showCreatePlaylistModal: true })}>
            <i className="material-icons">playlist_add</i>
            New Playlist
          </button>
          {playlists &&
            playlists.map(playList => (
              <button className={`${button.btn} ${flex.justify_start}`} type="button" key={playList.id} onClick={() => addSongsToPlaylist(songsIds, playList.id)}>
                <i className="material-icons">queue_music</i>
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
