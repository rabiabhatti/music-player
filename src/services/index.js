// @flow

import type { ServiceName } from '~/types'
import type { Service } from './types'
import googleDriveService from './googledrive'

const services: Array<Service> = [googleDriveService]

export default services
