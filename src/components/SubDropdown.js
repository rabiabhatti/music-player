// @flow

import React from 'react'

export default (props: {| children?: React$Node |}) => (
  <div className="section-sub-dropdown">
    <i className="material-icons">play_arrow</i>
    <div className="sub-dropdown-content dropdown-content hidden">{props.children}</div>
  </div>
)
