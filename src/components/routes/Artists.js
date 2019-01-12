// @flow

import * as React from 'react'

import { getArtistsFromSongs } from '~/common/songs'

import flex from '~/styles/flex.less'
import button from '~/styles/button.less'
import artists from '~/styles/artists.less'

import ContentCard from '../ContentCard'
import PreLoader from '~/components/PreLoader'

type Props = {||}
type State = {|
  selected: ?{|
    type: string,
    identifier: string,
  |},
|}

export default class Artists extends React.Component<Props, State> {
  state = {
    selected: null,
  }

  render() {
    const { selected } = this.state

    return (
      <PreLoader>
        {({ songs }) => {
          const artistsFromSongs = getArtistsFromSongs(songs)

          return (
            <React.Fragment>
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
            </React.Fragment>
          )
        }}
      </PreLoader>
    )
  }
}
