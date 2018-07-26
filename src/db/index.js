// @flow

declare var Dexie

const db = new Dexie('player')
db.version(1).stores({
  songs: '++id, source, &sourceId, sourceUid, filename, duration, *meta, artist, album, state',
})

export default db
