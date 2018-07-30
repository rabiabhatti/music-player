// @flow

import React from 'react'
import { connect } from 'react-redux'

import { setSelected, type ComponentsStateSelected } from '~/redux/components'

import Picker from './Picker'
import Logout from './Logout'

type Props = {|
  selected: ComponentsStateSelected,
  setSelected: typeof setSelected,
|}
type State = {||}

class Sidebar extends React.Component<Props, State> {
  render() {
    const { selected } = this.props

    return (
      <div className="section-sidebar">
        <div className="flex-column">
          <input id="sidebar-search-input" type="text" placeholder="Search" />
          <div className="sidebar-content flex-column">
            <h3>Library</h3>
            <a
              className={`content-row align-center ${selected && selected.type === 'RecentlyPlayed' ? 'active' : ''}`}
              style={{ cursor: 'pointer' }}
              onClick={() => this.props.setSelected({ type: 'RecentlyPlayed' })}
            >
              <i className="material-icons row-icon">access_time</i>Recently Played
            </a>
            <a
              className={`content-row align-center ${selected && selected.type === 'Songs' ? 'active' : ''}`}
              style={{ cursor: 'pointer' }}
              onClick={() => this.props.setSelected({ type: 'Songs' })}
            >
              <i className="material-icons row-icon">music_note</i>Songs
            </a>
            <a
              className={`content-row align-center ${selected && selected.type === 'Albums' ? 'active' : ''}`}
              style={{ cursor: 'pointer' }}
              onClick={() => this.props.setSelected({ type: 'Albums' })}
            >
              <i className="material-icons row-icon">album</i>Albums
            </a>
            <a
              className={`content-row align-center ${selected && selected.type === 'Artists' ? 'active' : ''}`}
              style={{ cursor: 'pointer' }}
              onClick={() => this.props.setSelected({ type: 'Artists' })}
            >
              <i className="material-icons row-icon">mic</i>Artists
            </a>
            <a
              className={`content-row align-center ${selected && selected.type === 'Genres' ? 'active' : ''}`}
              style={{ cursor: 'pointer' }}
              onClick={() => this.props.setSelected({ type: 'Genres' })}
            >
              <i className="material-icons row-icon">queue_music</i>Genres
            </a>
          </div>
          <div className="sidebar-content flex-column">
            <h3>PlayLists</h3>
            <a
              className={`content-row align-center ${selected && selected.type === 'Playlist' ? 'active' : ''}`}
              style={{ cursor: 'pointer' }}
              onClick={() => this.props.setSelected({ type: 'Playlist' })}
            >
              <i className="material-icons row-icon">playlist_play</i>90's
            </a>
            <a
              className={`content-row align-center ${selected && selected.type === 'Playlist' ? 'active' : ''}`}
              style={{ cursor: 'pointer' }}
              onClick={() => this.props.setSelected({ type: 'Playlist' })}
            >
              <i className="material-icons row-icon">playlist_play</i>Peace of Mind
            </a>
            <a
              className={`content-row align-center ${selected && selected.type === 'Playlist' ? 'active' : ''}`}
              style={{ cursor: 'pointer' }}
              onClick={() => this.props.setSelected({ type: 'Playlist' })}
            >
              <i className="material-icons row-icon">playlist_play</i>Rock n Roll
            </a>
            <button />
          </div>
          <Picker />
          <Logout />
        </div>
      </div>
    )
  }
}

export default connect(({ components }) => ({ selected: components.selected }), { setSelected })(Sidebar)
