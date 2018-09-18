// @flow

import React from 'react'
import { compose } from 'recompose'

import db from '~/db'
import { incrementNonce } from '~/redux/songs'
import type { UserAuthorization } from '~/redux/user'

import services from '~/services'
import connect from '~/common/connect'

type Props = {|
  authorizations: Array<UserAuthorization>,
  incrementNonce: () => void,
|}
type State = {||}

class Picker extends React.Component<Props, State> {
  createPicker = (e: SyntheticEvent<HTMLButtonElement>) => {
    e.preventDefault()
    const { authorizations } = this.props
    if (!authorizations.length) {
      console.warn('No authorizations found')
      return
    }
    authorizations.forEach(authorization => {
      const service = services.find(item => item.name === authorization.service)
      if (!service) {
        console.warn('Service not found for authorization', authorization)
        return
      }

      service
        .addFiles(authorization)
        .then(filesChosen => {
          db.songs.bulkAdd(filesChosen)
          this.props.incrementNonce()
        })
        .catch(console.error)
    })
  }

  render() {
    return (
      <button className="picker" onClick={this.createPicker}>
        Add Songs
      </button>
    )
  }
}

export default compose(
  connect(
    state => ({ authorizations: state.user.authorizations.toArray() }),
    { incrementNonce },
  ),
)(Picker)
