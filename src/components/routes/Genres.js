// @flow

import * as React from 'react'
import connect from '~/common/connect'

import db from '~/db'
import type { File } from '~/types'
import { getGenresFromSongs } from '~/common/songs'

import flex from '~/less/flex.less'
import button from '~/less/button.less'
import artists from '~/less/artists.less'

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

class Genres extends React.Component<Props, State> {
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

    const genres = getGenresFromSongs(songs)

    return songs.length ? (
      <div className={`${flex.row} bound`} style={{ overflow: `${showContextMenu ? 'hidden' : 'scroll'}` }}>
        <div className={`${artists.artists_bar}`}>
          <button
            type="button"
            className={`${flex.align_center} ${button.btn} ${button.btn_round_half} ${!selected ? 'active' : ''}`}
            onClick={() => this.setState({ selected: null })}
          >
            <i className="material-icons">queue_music</i>
            All Genres
          </button>

          {Object.keys(genres).map(genre => (
            <button
              type="button"
              key={genre}
              className={`${flex.align_center} ${button.btn} ${button.btn_round_half} ${
                selected && selected.type === 'genre' && selected.identifier === genre ? 'active' : ''
              }`}
              onClick={() =>
                this.setState({
                  selected: { type: 'genre', identifier: genre },
                })
              }
            >
              {genre}
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
)(Genres)
