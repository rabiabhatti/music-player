// @flow

import React from 'react'
import Fuse from 'fuse.js'

import db from '~/db'
import connect from '~/common/connect'
import { navigateTo } from '~/redux/router'
import getEventPath from '~/common/getEventPath'

import flex from '~/less/flex.less'
import input from '~/less/input.less'
import header from '~/less/header.less'
import button from '~/less/button.less'

type Props = {|
  navigateTo: navigateTo,
|}
type State = {|
  value: string,
  selected: number,
  emptyResult: boolean,
  results: Array<Object>,
|}

const ATTRIBUTES_TO_SEARCH_IN = ['meta.name', 'meta.album_artists', 'meta.album', 'meta.artists', 'meta.genre']

class Search extends React.Component<Props, State> {
  fuseInstance = null
  ref: ?HTMLDivElement = null
  nodes: Array<number> = []

  state = {
    value: '',
    results: [],
    selected: 0,
    emptyResult: false,
  }

  componentDidMount() {
    document.addEventListener('click', this.handleBodyClick)
    document.addEventListener('keydown', this.handleKeyPress)
  }
  componentWillUnmount() {
    document.removeEventListener('click', this.handleBodyClick)
    document.removeEventListener('keydown', this.handleKeyPress)
  }

  // TODO: Clear the cache value when NONCE changes
  async getFuseInstance() {
    let { fuseInstance } = this
    if (!fuseInstance) {
      fuseInstance = new Fuse(await db.songs.toArray(), {
        shouldSort: true,
        threshold: 0.3,
        location: 0,
        distance: 100,
        maxPatternLength: 32,
        minMatchCharLength: 3,
        keys: ATTRIBUTES_TO_SEARCH_IN,
      })
      this.fuseInstance = fuseInstance
    }
    return fuseInstance
  }

  handleBodyClick = (e: MouseEvent) => {
    if (e.defaultPrevented) {
      return
    }
    const firedOnSelf = getEventPath(e).includes(this.ref)
    if (!firedOnSelf) {
      this.setState({ results: [], emptyResult: false, value: '' })
    }
  }

  handleKeyPress = (e: KeyboardEvent) => {
    const { value, selected } = this.state
    if (e.key === 'Enter' && value !== '') {
      this.searchItem()
    } else if (e.key === 'ArrowDown') {
      this.setState({ selected: selected + 1 })
    }
  }

  navigateTo = (e: SyntheticEvent<HTMLButtonElement>, name: string, id: number) => {
    const { navigateTo: navigateToProp } = this.props

    navigateToProp({ name, id })
    this.setState({ results: [], emptyResult: false, value: '' })
  }

  searchItem = async () => {
    const { value } = this.state

    if (value !== '') {
      const fuseInstance = await this.getFuseInstance()
      const results = fuseInstance.search(value)
      if (!results.length) {
        this.setState({ emptyResult: true })
      } else {
        this.setState({ results, emptyResult: false })
      }
    }
  }

  handleChange = (event: SyntheticInputEvent<HTMLInputElement>) => {
    if (event.target.value === '') {
      this.setState({ results: [], emptyResult: false })
    }
    this.setState({ value: event.target.value })
  }

  render() {
    const { value, selected, results, emptyResult } = this.state

    return (
      <div
        ref={element => {
          this.ref = element
        }}
        className={`${flex.wrap} ${header.search}`}
      >
        <div className={`${flex.align_center} ${header.input_container}`}>
          <input
            name="q"
            id="search"
            type="text"
            value={value}
            onFocus={e => {
              e.target.placeholder = ''
            }}
            onBlur={e => {
              e.target.placeholder = 'Type to search...'
            }}
            onInput={this.handleChange}
            placeholder="Type to search..."
            className={`${input.input} ${input.input_search} ${
              results.length !== 0 || emptyResult ? `${header.input_typing}` : ''
            }`}
          />
          <button type="button" className={`${header.input_search_icon} ${button.btn}`} onClick={this.searchItem}>
            <i title="Search" className="material-icons">
              search
            </i>
          </button>
        </div>
        {emptyResult &&
          value !== '' && (
            <div className={`${header.serach_result_container}`}>
              <p className={`${header.no_search_result}`}>No results found...</p>
            </div>
          )}
        {results.length !== 0 &&
          value !== '' && (
            <div className={`${header.serach_result_container}`}>
              {results.map((song, i) => (
                <button
                  type="button"
                  key={song.id}
                  onClick={e => this.navigateTo(e, 'Songs', song.id)}
                  className={`${button.btn} ${header.search_btn} ${selected === i ? `${header.selected}` : ''}`}
                >
                  {`${song.meta.name || song.filename}`}
                  <span className={`${header.artist}`}> {`${song.meta.artists_original || 'Unknown'}`}</span>
                </button>
              ))}
            </div>
          )}
      </div>
    )
  }
}

export default connect(
  null,
  {
    navigateTo,
  },
)(Search)
