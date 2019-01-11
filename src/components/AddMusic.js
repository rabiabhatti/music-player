// @flow

import React from 'react'

import db from '~/db'
import type { UserAuthorization } from '~/redux/user'

import services from '~/services'
import connect from '~/common/connect'

import flex from '~/styles/flex.less'
import button from '~/styles/button.less'
import addMusic from '~/styles/addMusic.less'
import HeaderDropdown from '~/components/Dropdown/HeaderDropdown'

type Props = {|
  authorizations: Array<UserAuthorization>,
|}
class AddMusic extends React.PureComponent<Props> {
  createPicker = (e: SyntheticEvent<HTMLButtonElement>, authorization: UserAuthorization) => {
    e.preventDefault()

    const service = services.find(item => item.name === authorization.service)
    if (!service) {
      console.warn('Service not found for authorization', authorization)
      return
    }

    service
      .addFiles(authorization)
      .then(filesChosen => {
        db.songs.bulkAdd(filesChosen)
      })
      .catch(console.error)
  }

  render() {
    const { authorizations } = this.props

    return authorizations.length ? (
      <HeaderDropdown buttonTitle="Add Music" buttonIcon="add" className={`${addMusic.add_music}`}>
        <h3>Choose Service</h3>
        {authorizations.map(authorization => {
          const service = services.find(item => item.name === authorization.service)
          if (!service) {
            return null
          }

          return (
            <button
              key={`${authorization.uid}-${authorization.service}`}
              className={`${button.btn} ${flex.justify_start}`}
              type="button"
              onClick={e => this.createPicker(e, authorization)}
            >
              <img className={`${addMusic.serviceImg}`} src={service.thumbnail} alt={service.name} />
              <div className={`${flex.column} ${flex.align_start}`}>
                <span className={`${addMusic.service_user_name}`}>{authorization.user_name}</span>
                <span className={`${addMusic.service_email}`}>{authorization.email}</span>
              </div>
            </button>
          )
        })}
      </HeaderDropdown>
    ) : null
  }
}

export default connect(state => ({ authorizations: state.user.authorizations.toArray() }))(AddMusic)
