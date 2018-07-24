// @flow

import React from 'react'

import Picker from './Picker'
import Logout from './Logout'

export default () => (
  <div className="section-sidebar">
    <div className="flex-column">
      <input id="sidebar-search-input" type="text" placeholder="Search" />
      <div className="sidebar-content flex-column">
        <h3>Library</h3>
        <a className="content-row align-center">
          <i className="material-icons row-icon">access_time</i>Recently Played
        </a>
        <a className="content-row align-center">
          <i className="material-icons row-icon">music_note</i>Songs
        </a>
        <a className="content-row align-center">
          <i className="material-icons row-icon">album</i>Albums
        </a>
        <a className="content-row align-center">
          <i className="material-icons row-icon">mic</i>Artists
        </a>
        <a className="content-row align-center">
          <i className="material-icons row-icon">queue_music</i>Genres
        </a>
      </div>
      <div className="sidebar-content flex-column">
        <h3>PlayLists</h3>
        <a className="content-row align-center">
          <i className="material-icons row-icon">playlist_play</i>90's
        </a>
        <a className="content-row align-center">
          <i className="material-icons row-icon">playlist_play</i>Peace of Mind
        </a>
        <a className="content-row align-center">
          <i className="material-icons row-icon">playlist_play</i>Rock n Roll
        </a>
        <button />
      </div>
      <Picker />
      <Logout />
    </div>
  </div>
)
