// @flow

import React from 'react'

import Popup from './Popup'
import Dropdown from './Dropdown'
import SubDropdown from './SubDropdown'

import cover from '../static/img/album-cover.jpg'

const DEFAULT_PROGRESS = 50
const DEFAULT_VOLUME = 50
const DEFAULT_FULL_SCREEN = false

type Props = {||}
type State = {|
  progress: number,
  volume: number,
  fullScreen: boolean,
  showPlaylistPopup: number | null,
|}

export default class Player extends React.Component<Props, State> {
  state = {
    progress: DEFAULT_PROGRESS,
    volume: DEFAULT_VOLUME,
    fullScreen: DEFAULT_FULL_SCREEN,
    showPlaylistPopup: null,
  }

  showPlaylistPopupInput = (e: SyntheticInputEvent<HTMLInputElement>) => {
    e.preventDefault()
    this.setState({ showPlaylistPopup: Date.now() })
  }

  onDrag = () => {
    const inlineStyle = document.createElement('style')
    const rangeSelector = document.querySelectorAll('[type=range]')
    const inlineStyleContent = []
    if (document.body) {
      document.body.appendChild(inlineStyle)
    }
    const eventname = new Event('input')
    for (const item of rangeSelector) {
      item.addEventListener(
        'input',
        function() {
          const rangeInterval = Number(this.getAttribute('max') - this.getAttribute('min'))
          const rangePercent = (Number(this.value) + Math.abs(this.getAttribute('min'))) / rangeInterval * 97
          writeStyle({
            id: this.id,
            percent: rangePercent,
          })
        },
        false,
      )
      item.dispatchEvent(eventname)
    }
    function writeStyle(obj) {
      const find = inlineStyleContent.map(x => x.id).indexOf(obj.id)
      let styleText = ''
      if (find === -1) {
        inlineStyleContent.push(obj)
      } else {
        inlineStyleContent[find] = obj
      }
      for (const item of inlineStyleContent) {
        styleText += `#${item.id}::-webkit-slider-runnable-track{background-size:${item.percent}% 100%} `
      }
      inlineStyle.textContent = styleText
    }
  }

  render() {
    const { progress, volume, fullScreen, showPlaylistPopup } = this.state

    return (
      <div className="section-player">
        {showPlaylistPopup ? (
          <Popup hash={showPlaylistPopup.toString()}>
            <input type="text" placeholder="Choose name" />
            <button className="btn-blue">Save</button>
          </Popup>
        ) : (
          <div />
        )}
        <div className="section-player-cover" style={{ backgroundImage: `url(${cover})` }}>
          <div className="section-song-description flex-row space-between">
            <div className="song-details">
              <h1 className="song-title">Ho ho ho</h1>
              <h4 className="song-artist">Sia Furler</h4>
            </div>
            <Dropdown>
              <div className="align-center space-between sub-dropdown-trigger">
                <a>Add to Playlist</a>
                <SubDropdown>
                  <a onClick={this.showPlaylistPopupInput} className="dropdown-option">
                    New Playlist
                  </a>
                  <a className="dropdown-option">90's</a>
                  <a className="dropdown-option">Peace of Mind</a>
                  <a className="dropdown-option">Rock n Roll</a>
                </SubDropdown>
              </div>
              <a className="dropdown-option">Play Next</a>
              <a className="dropdown-option">Play Later</a>
              <a className="dropdown-option">Delete from Library</a>
            </Dropdown>
          </div>
          <div className="section-player-controls align-center space-between">
            <div className="section-player-btns align-center">
              <i title="Previous" className="material-icons">
                fast_rewind
              </i>
              {progress === 0 ? (
                <i title="Play" className="material-icons play-btn">
                  play_circle_outline
                </i>
              ) : (
                <i title="Pause" className="material-icons play-btn">
                  pause_circle_outline
                </i>
              )}
              <i title="Next" className="material-icons">
                fast_forward
              </i>
            </div>
            <div className="section-progress align-center space-between">
              <span>2:08</span>
              <input id="range" onMouseMove={this.onDrag} className="section-progressbar" type="range" min="1" max="100" />
              <span>3:38</span>
            </div>
            <div className="section-volume align-center">
              {volume === 0 ? (
                <i title="Volume" className="material-icons">
                  volume_off
                </i>
              ) : volume === 30 ? (
                <i title="Volume" className="material-icons">
                  volume_down
                </i>
              ) : (
                <i title="Volume" className="material-icons">
                  volume_up
                </i>
              )}
              <input
                id="range"
                className="volume-bar"
                onMouseMove={this.onDrag}
                title="Volume"
                type="range"
                min="1"
                max="100"
              />
              <i title="Shuffle" className="material-icons">
                sync
              </i>
              {fullScreen ? (
                <i title="Exit full screen" className="material-icons">
                  fullscreen_exit
                </i>
              ) : (
                <i title="Full screen" className="material-icons">
                  fullscreen
                </i>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
