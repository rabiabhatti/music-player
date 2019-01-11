// @flow

import { connect, type MapDispatchToProps } from 'react-redux'
import type { ReduxState } from '~/redux/types'

type MapStateToProps = (state: ReduxState, ownProps: Object) => { [string]: any }

export default function(mapStateToProps: ?MapStateToProps, mapDispatchToProps: ?MapDispatchToProps<any, any, any>) {
  return connect(
    mapStateToProps,
    mapDispatchToProps,
  )
}
