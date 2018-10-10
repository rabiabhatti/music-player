// @flow

import React from 'react'

import getEventPath from '~/common/getEventPath'

import flex from '~/less/flex.less'
import header from '~/less/header.less'
import button from '~/less/button.less'

import Accounts from '~/components/Accounts'
import Sidebar from '~/components/Sidebar'
import Search from './Search'

type Props = {||}
type State = {|
  showSidebar: boolean,
|}

export default class ResponsiveHeader extends React.Component<Props, State> {
  ref: ?HTMLDivElement = null
  btnref: ?HTMLButtonElement = null

  state = {
    showSidebar: false,
  }

  componentDidMount() {
    document.addEventListener('click', this.handleClick)
  }
  componentWillUnmount() {
    document.removeEventListener('click', this.handleClick)
  }

  handleClick = (e: MouseEvent) => {
    if (e.defaultPrevented) {
      return
    }
    const { showSidebar } = this.state
    const firedOnSelf = getEventPath(e).includes(this.ref)
    const firedOnButton = getEventPath(e).includes(this.btnref)

    if (firedOnButton) {
      this.setState({
        showSidebar: true,
      })
    } else if (showSidebar && !firedOnSelf) {
      this.setState({
        showSidebar: !showSidebar,
      })
    }
  }

  render() {
    const { showSidebar: showSidebarState } = this.state

    return (
      <div className={`${header.responsive_header} ${flex.row} ${flex.space_between}`}>
        <button type="button" className={`${button.btn}`} onClick={(e) => this.handleClick(e)} ref={element => {
          this.btnref = element
        }}>
          <i title="Menu" className='material-icons'>
            menu
          </i>
        </button>
        <div className={`${flex.row} ${header.search_wrapper}`}>
          <Search />
          <Accounts />
        </div>
        <div className={`${showSidebarState ? header.show_sidebar : ''} ${header.sidebar_trigger}`} ref={element => {
          this.ref = element
        }}>
          <Sidebar />
        </div>
      </div>
    )
  }
}
