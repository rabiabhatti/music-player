// @flow

export type ServiceName = 'googledrive'

export type ArtWork = {
  source: 'googledrive',
  sourceId: string,
  sourceUid: string,
  filename: string,
}

export type FileMeta = {|
  name: string,
  artists: Array<string>,
  artists_original: string,
  album: string,
  album_artists: Array<string>,
  album_artists_original: string,
  year: string,
  track: number,
  disc: number,
  genre: Array<string>,
|}

export type FileArtwork = {|
  album: ?ArtWork,
  artwork: ?ArtWork,
|}

export type File = {
  source: ServiceName,
  sourceId: string,
  sourceUid: string,
  filename: string,
  duration: number,
  state: 'downloaded' | 'downloading' | 'pending',
  meta: ?FileMeta,
  artwork: ?FileArtwork,
}
