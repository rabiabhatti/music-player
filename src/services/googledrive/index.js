// @flow

import flatten from 'lodash/flatten'

import type { File } from '~/types'
import type { UserAuthorization } from '~/redux/user'
import type { Service } from '../types'
import { API_KEY, CLIENT_ID, SCOPES, DISCOVERY_DOCS, APP_ID } from './constants'

declare var gapi
declare var google
type GoogleDocType = $FlowFixMe

function showPickerView(authorization: UserAuthorization): Promise<Array<GoogleDocType>> {
  return new Promise(function(resolve, reject) {
    const View = new google.picker.DocsView(google.picker.ViewId.FOLDERS)
      .setMimeTypes('application/vnd.google-apps.audio')
      .setParent('root')
      .setOwnedByMe(true)
      .setIncludeFolders(true)
      .setSelectFolderEnabled(true)

    const picker = new google.picker.PickerBuilder()
      .enableFeature(google.picker.Feature.NAV_HIDDEN)
      .enableFeature(google.picker.Feature.MULTISELECT_ENABLED)
      .setAppId(APP_ID)
      .setOAuthToken(authorization.meta.accessToken)
      .addView(View)
      .setDeveloperKey(API_KEY)
      .setCallback(data => {
        if (data.action === google.picker.Action.CANCEL) {
          console.warn('User cancelled', data)
          reject(new Error('User cancelled'))
        } else if (data.action === google.picker.Action.PICKED) {
          resolve(data.docs)
        }
      })
      .build()
    picker.setVisible(true)
  })
}

async function resolveFileIds(authorization: UserAuthorization, doc: GoogleDocType): Promise<Array<GoogleDocType>> {
  // TODO: How to use a specific access token with gapi?
  const { result } = await gapi.client.drive.files.list({
    q: `'${doc.id}' in parents`,
  })
  let files = []
  await Promise.all(
    result.files.map(async file => {
      if (file.mimeType === 'application/vnd.google-apps.folder') {
        files = files.concat(await resolveFileIds(authorization, file))
      } else if (file.mimeType.startsWith('audio/')) {
        files.push(file)
      }
    }),
  )

  return files
}

const SERVICE_NAME = 'GoogleDrive'
const googleDriveService: Service = {
  name: SERVICE_NAME,
  async load() {
    await Promise.all([
      new Promise(function(resolve) {
        gapi.load('client:auth2', resolve)
      }),
      new Promise(function(resolve) {
        gapi.load('picker', resolve)
      }),
    ])
    gapi.client.init({
      apiKey: API_KEY,
      clientId: CLIENT_ID,
      discoveryDocs: DISCOVERY_DOCS,
      scope: SCOPES,
    })
  },
  async authorize(): Promise<UserAuthorization> {
    const auth = await gapi.auth2.getAuthInstance().signIn()
    const basicProfile = auth.getBasicProfile()
    const authResponse = auth.getAuthResponse()

    return {
      service: SERVICE_NAME,
      email: basicProfile.U3,
      uid: basicProfile.getId(),
      user_name: basicProfile.ig,
      meta: {
        expiresAt: authResponse.expires_at,
        accessToken: authResponse.access_token,
      },
    }
  },
  // TODO: Use access token from authorization
  // eslint-disable-next-line
  async unauthorize(authorization: UserAuthorization): Promise<void> | void {
    gapi.auth2.getAuthInstance().signOut()
  },
  async addFiles(authorization: UserAuthorization): Promise<Array<File>> {
    const selectedItems = await showPickerView(authorization)
    const files = flatten(await Promise.all(selectedItems.map(item => resolveFileIds(authorization, item))))

    return files.map(file => {
      const artwork = {
        source: SERVICE_NAME,
        sourceId: file.id,
        sourceUid: authorization.uid,
        filename: file.name,
      }
      return {
        source: SERVICE_NAME,
        sourceId: file.id,
        sourceUid: authorization.uid,
        filename: file.name,
        duration: null,
        meta: null,
        artwork: {
          album: null,
          artwork,
        },
        state: 'pending',
      }
    })
  },
  async getFile(authorization: UserAuthorization, sourceId: string): Promise<Response> {
    const request = new Request(`https://www.googleapis.com/drive/v3/files/${sourceId}/?alt=media`)

    const cache = await caches.open('google-drive')
    const cached = await cache.match(request)

    let response
    if (cached) {
      response = cached
    } else {
      response = await fetch(request, {
        credentials: 'omit',
        headers: {
          Authorization: `Bearer ${authorization.meta.accessToken}`,
        },
      })
      cache.put(request, response.clone())
    }
    return response
  },
}

export default googleDriveService
