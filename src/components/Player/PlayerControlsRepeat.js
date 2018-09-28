// @flow

import React from 'react'
import connect from '~/common/connect'
import { setSongRepeat, type RepeatMode } from '~/redux/songs'

import button from '~/less/button.less'

const BUTTONS_CONFIG = {
  none: {
    dim: true,
    icon: 'repeat',
    newState: 'all',
    title: 'Click to Repeat All',
  },
  all: {
    dim: false,
    icon: 'repeat',
    newState: 'single',
    title: 'Click to Repeat Single',
  },
  single: {
    dim: false,
    icon: 'repeat_one',
    newState: 'none',
    title: 'Click to disable Repeat',
  },
}

const PlayerControlsRepeat = ({
  repeatMode,
  setSongRepeat: setSongRepeatProp,
}: {
  repeatMode: RepeatMode,
  setSongRepeat: (mode: RepeatMode) => void,
}) => {
  const { dim, icon, newState, title } = BUTTONS_CONFIG[repeatMode]

  return (
    <button
      type="button"
      className={`${button.btn} ${button.btn_round}`}
      onClick={() => {
        setSongRepeatProp(newState)
      }}
    >
      <i title={title} className="material-icons" {...(dim ? { style: { color: '#5959595e' } } : {})}>
        {icon}
      </i>
    </button>
  )
}

export default connect(
  ({ songs }) => ({
    repeatMode: songs.songsRepeat,
  }),
  { setSongRepeat },
)(PlayerControlsRepeat)
