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
  duration: ?string,
  state: 'downloaded' | 'downloading' | 'pending',
  meta: ?{|
    name: string,
    artist: Array<string>,
    album: string,
    album_artist: Array<string>,
    year: string,
    track: number,
    disc: number,
    genre: Array<string>,
    picture: Object,
  |},
  artist: ?string,
  album: ?string,
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
