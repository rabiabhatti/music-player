// @flow

import * as React from 'react'
import connect from '~/common/connect'

import db from '~/db'
import { getArtistsFromSongs } from '~/common/songs'
import type { File } from '~/types'

import flex from '~/styles/flex.less'
import button from '~/styles/button.less'
import artists from '~/styles/artists.less'

import ContentCard from '../ContentCard'
import EmptyMusicText from '../EmptyMusicText'

type Props = {|
  nonce: number,
  showContextMenu: boolean,
|}
type State = {|
  songs: Array<File>,
  selected: ?{|
    type: string,
    identifier: string,
  |},
|}

class Artists extends React.Component<Props, State> {
  state = {
    songs: [],
    selected: null,
  }

  componentDidMount() {
    this.fetchSongs()
  }

  componentDidUpdate(prevProps) {
    const { nonce } = this.props
    if (prevProps.nonce !== nonce) this.fetchSongs()
  }

  fetchSongs = async () => {
    const songs = await db.songs.toArray()
    this.setState({ songs })
  }

  render() {
    const { showContextMenu } = this.props
    const { songs, selected } = this.state

    const artistsFromSongs = getArtistsFromSongs(songs)

    return songs.length ? (
      <div className={`${flex.row} bound`} style={{ overflow: `${showContextMenu ? 'hidden' : 'scroll'}` }}>
        <div className={`${artists.artists_bar}`}>
          <button
            type="submit"
            className={`${flex.align_center} ${button.btn} ${button.btn_round_half} ${!selected ? 'active' : ''}`}
            onClick={() => this.setState({ selected: null })}
          >
            <i className="material-icons">mic</i>
            All Artists
          </button>
          {Object.keys(artistsFromSongs).map(artist => (
            <button
              type="submit"
              key={artist}
              className={`${flex.align_center} ${button.btn} ${button.btn_round_half} ${
                selected && selected.type === 'artist' && selected.identifier === artist ? 'active' : ''
              }`}
              onClick={() =>
                this.setState({
                  selected: { type: 'artist', identifier: artist },
                })
              }
            >
              {artist}
            </button>
          ))}
        </div>
        <ContentCard selected={selected} />
      </div>
    ) : (
      <EmptyMusicText />
    )
  }
}

export default connect(
  ({ songs }) => ({ nonce: songs.nonce, showContextMenu: songs.showContextMenu }),
  null,
)(Artists)
