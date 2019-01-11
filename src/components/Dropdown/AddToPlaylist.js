// @flow

import * as React from 'react'
import isEqual from 'lodash/isEqual'
import connect from '~/common/connect'
import intersection from 'lodash/intersection'

import db from '~/db'
import { addSongsToPlaylist } from '~/common/songs'
import CreateNewPlaylist from '~/components/Popup/CreateNewPlaylist'

import flex from '~/styles/flex.less'
import button from '~/styles/button.less'
import dropdown from '~/styles/dropdown.less'

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
    if (prevProps.nonce !== nonce) this.fetchPlaylists()
  }

  fetchPlaylists = async () => {
    const playlists = await db.playlists.toArray()
    if (playlists.length) this.setState({ playlists })
  }

  render() {
    const { songsIds } = this.props
    const { showCreatePlaylistModal, playlists } = this.state

    if (showCreatePlaylistModal) {
      return <CreateNewPlaylist handleClose={() => this.setState({ showCreatePlaylistModal: false })} songsIds={songsIds} />
    }

    return (
      <div className={`${dropdown.sub_dropdown_trigger}`}>
        <button
          type="button"
          className={`${button.btn} ${flex.space_between} ${flex.justify_start}`}
          onClick={e => e.preventDefault()}
        >
          <i className="material-icons">add</i>
          Add to Playlist
        </button>
        <div className={`${dropdown.sub_dropdown} ${dropdown.dropdown_content} hidden`}>
          <button
            className={`${button.btn} ${flex.justify_start}`}
            type="button"
            onClick={() => this.setState({ showCreatePlaylistModal: true })}
          >
            <i className="material-icons">playlist_add</i>
            New Playlist
          </button>
          {playlists &&
            playlists.map(playList => (
              <button
                type="button"
                key={playList.id}
                className={`${button.btn} ${flex.justify_start}`}
                disabled={isEqual(intersection(playList.songs, songsIds), songsIds)}
                onClick={() => addSongsToPlaylist(songsIds, playList.id)}
              >
                <i className="material-icons">queue_music</i>
                {playList.name}
              </button>
            ))}
        </div>
      </div>
    )
  }
}

export default connect(({ songs }) => ({
  nonce: songs.nonce,
}))(AddToPlaylist)
