// @flow

import React from 'react'

import db from '~/db'

type Props = {|
  children: React$Node,
|}
type State = {||}

export default class Sidebar extends React.Component<Props, State> {
  render() {
    return (
      <div className="section-sub-dropdown">
        <i className="material-icons">play_arrow</i>
        <div className="sub-dropdown-content dropdown-content hidden">{this.props.children}</div>
      </div>
    )
  }
}
