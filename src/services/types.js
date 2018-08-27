// @flow

import type { UserAuthorization } from '~/redux/user'
import type { ServiceName } from '~/types'

export interface Service {
  name: ServiceName;
  load(): Promise<void>;
  authorize(): Promise<UserAuthorization>;
  unauthorize(authorization: UserAuthorization): Promise<void> | void;
  addFiles(authorization: UserAuthorization): Promise<Array<File>>;
  getFile(authorization: UserAuthorization, sourceId: string): Promise<Response>;
}
