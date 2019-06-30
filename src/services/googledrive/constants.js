// @flow

const APP_ID = process.env.PROJECT_ID
const API_KEY = process.env.API_KEY
const CLIENT_ID = process.env.CLIENT_ID

const SCOPES = 'https://www.googleapis.com/auth/drive.readonly'
const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest']

export { APP_ID, API_KEY, CLIENT_ID, SCOPES, DISCOVERY_DOCS }
