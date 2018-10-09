// @flow

export type ServiceName = 'GoogleDrive'

export type ArtWork =
  | {
      source: ServiceName,
      sourceId: string,
      sourceUid: string,
      filename: string,
    }
  | { uri: ?string }

export type FileMeta = {|
  name: string,
  artists: Array<string>,
  album: string,
  artists_original: string,
  album_artists: Array<string>,
  album_artists_original: string,
  year: string,
  track: number,
  disc: number,
  genre: Array<string>,
|}

export type FileArtwork = {|
  album: ?ArtWork,
  artwork?: ?ArtWork,
|}

export type File = {
  source: ServiceName,
  sourceId: string,
  sourceUid: string,
  filename: string,
  duration: number,
  state: 'downloaded' | 'downloading' | 'pending' | 'error',
  stateMessage: ?string,
  meta: ?FileMeta,
  artwork: ?FileArtwork,
}
