// @flow

import React from 'react'

import db from '~/db'

type Props = {|
  children: React$Node,
|}
type State = {|
  playlists: Array<Object>,
|}

export default class Sidebar extends React.Component<Props, State> {
  state = {
    playlists: [],
  }

  async componentDidMount() {
    const playlists = await db.playlists.toArray()
    this.setState({ playlists: playlists })
  }

  render() {
    const { playlists } = this.state

    return (
      <div className="section-sub-dropdown">
        <i className="material-icons">play_arrow</i>
        <div className="sub-dropdown-content dropdown-content hidden">
          {this.props.children}
          {playlists.map(playlist => (
            <a key={playlist.id} className="dropdown-option">
              {playlist.name}
            </a>
          ))}
        </div>
      </div>
    )
  }
}
