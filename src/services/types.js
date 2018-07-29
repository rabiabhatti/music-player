// @flow

import type { UserAuthorization } from '~/redux/user'
import type { ServiceName } from '~/types'

type ArtWork = {
  source: 'googledrive',
  sourceId: string,
  sourceUid: string,
  filename: string,
}
type File = {
  source: ServiceName,
  sourceId: string,
  sourceUid: string,
  filename: string,
  duration: number,
  state: 'downloaded' | 'downloading' | 'pending',
  meta: ?{|
    name: string,
    artists: Array<string>,
    album: string,
    album_artists: Array<string>,
    year: string,
    track: number,
    disc: number,
    genre: Array<string>,
    picture: Object,
  |},
  artwork: ?{
    album: ?ArtWork,
    artwork: ?ArtWork,
  },
}

interface Service {
  name: ServiceName;
  load(): Promise<void>;
  authorize(): Promise<UserAuthorization>;
  unauthorize(authorization: UserAuthorization): Promise<void> | void;
  addFiles(authorization: UserAuthorization): Promise<Array<File>>;
  getFile(authorization: UserAuthorization, sourceId: string): Promise<Response>;
}

export type { Service, File, ArtWork }
