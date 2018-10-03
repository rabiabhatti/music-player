// @flow

import React from 'react'

import Logout from '~/components/Logout'

import flex from '~/less/flex.less'
import input from '~/less/input.less'
import header from '~/less/header.less'
import button from '~/less/button.less'

type Props = {||}
type State = {|
  value: string,
|}

export default class Header extends React.Component<Props, State> {
  state = {
    value: '',
  }

  handleChange = (event: SyntheticInputEvent<HTMLInputElement>) => {
    this.setState({ value: event.target.value })
  }
  render() {
    const { value } = this.state
    return (
      <div className={`${header.header} ${flex.row} ${flex.justify_end}`}>
        <div className={`${flex.align_center} ${header.search} ${flex.justify_end}`}>
          <input
            name="q"
            id="search"
            type="search"
            value={value}
            onFocus={e => {
              e.target.placeholder = ''
            }}
            onBlur={e => {
              e.target.placeholder = 'Type to search...'
            }}
            onInput={this.handleChange}
            placeholder="Type to search..."
            className={`${input.input} ${input.input_search}`}
          />
          <button type="button" className={`${header.input_search_icon} ${button.btn}`}>
            <i title="Search" className='material-icons'>
              search
            </i>
          </button>

        </div>
        <Logout />
      </div>
    )
  }
}
