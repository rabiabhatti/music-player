// @flow

import * as React from 'react'

import Snackbar from './Snackbar'

type Props = {|
  text: string,
  type: string,
  handleClose?: ?() => void,
|}

export default function DownloadingSnackbar(props: Props) {
  const { handleClose, text, type } = props
  return (
    <Snackbar handleClose={handleClose} type={type}>
      <div>{text}</div>
    </Snackbar>
  )
}

DownloadingSnackbar.defaultProps = {
  handleClose: null,
}
