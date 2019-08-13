// @flow

import * as React from 'react'
import { connect } from 'react-redux'

import db from '~/db'
import type { File } from '~/types'

import flex from '~/styles/flex.less'
import EmptyMusicText from './EmptyMusicText'

type Props = {|
  nonce: number,
  children: Function,
  classname?: ?string,
  showContextMenu: boolean,
|}
type State = {|
  songs: Array<File>,
|}

class PreLoader extends React.Component<Props, State> {
  static defaultProps = {
    classname: null,
  }

  state = {
    songs: [],
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
    const { songs } = this.state
    const { children, showContextMenu, classname } = this.props

    return songs.length ? (
      <div
        className={`${flex.row} ${classname ? `${classname}` : ''} bound`}
        style={{ overflow: `${showContextMenu ? 'hidden' : 'scroll'}` }}
      >
        {children({ songs })}
      </div>
    ) : (
      <EmptyMusicText />
    )
  }
}

export default connect(({ songs }) => ({ nonce: songs.nonce, showContextMenu: songs.showContextMenu }))(PreLoader)
