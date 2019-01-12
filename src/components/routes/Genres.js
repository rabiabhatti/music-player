// @flow

import * as React from 'react'

import { getGenresFromSongs } from '~/common/songs'

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

export default class Genres extends React.Component<Props, State> {
  state = {
    selected: null,
  }

  render() {
    const { selected } = this.state

    return (
      <PreLoader>
        {({ songs }) => {
          const genres = getGenresFromSongs(songs)

          return (
            <React.Fragment>
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
            </React.Fragment>
          )
        }}
      </PreLoader>
    )
  }
}
