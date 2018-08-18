// @flow

import React from 'react'

const PlayerControlsVolume = () => (
  <React.Fragment>
    {localVolume === 0 ? (
      <i title="Volume" onClick={this.handleMuteVolume} className="material-icons">
        volume_off
      </i>
    ) : localVolume <= 40 ? (
      <i title="Volume" onClick={this.handleMuteVolume} className="material-icons">
        volume_down
      </i>
    ) : (
      <i title="Volume" onClick={this.handleMuteVolume} className="material-icons">
        volume_up
      </i>
    )}

    <div className="volume-progressbar">
      <div className="progress-fill" style={{ width: `${localVolume}%` }} />
      <input onChange={this.handleVolumeChange} title="Volume" type="range" value={localVolume} min="0" max="100" />
    </div>
  </React.Fragment>
)

export default PlayerControlsVolume
