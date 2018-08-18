// @flow

import path from 'path'
import { toNodeReadable } from 'web-streams-node'
import { parseStream } from 'music-metadata'

import type { File } from '../types'

const parsers = {
  mpeg() {
    return import('music-metadata/lib/mpeg')
  },
  apev2() {
    return import('music-metadata/lib/apev2')
  },
  mp4() {
    return import('music-metadata/lib/mp4')
  },
  asf() {
    return import('music-metadata/lib/asf')
  },
  flac() {
    return import('music-metadata/lib/flac')
  },
  ogg() {
    return import('music-metadata/lib/ogg')
  },
  riff() {
    return import('music-metadata/lib/riff')
  },
  wavpack() {
    return import('music-metadata/lib/wavpack')
  },
}

// TODO: Maybe , ?
const NAME_DELIMITERS = /&/
function normalizeArtist(name: string | Array<string>): Array<string> {
  if (!name) {
    return []
  }

  const nameArray = [].concat(name)
  let nameNormalized = []

  nameArray.forEach(function(chunk) {
    const chunks = chunk.split(NAME_DELIMITERS)
    nameNormalized = nameNormalized.concat(chunks.map(i => i.trim()).filter(Boolean))
  })

  return nameNormalized
}

export default async function parseMeta(
  song: File,
  response: Object,
): Promise<{ duration: number, meta: ?Object, artwork: ?Object }> {
  let metadata = {}
  const nodeStream = toNodeReadable(response.body)
  try {
    metadata = await parseStream(nodeStream, path.extname(song.filename), {
      path: song.filename,
      loadParser(parser) {
        return parsers[parser]().then(module => new module.default())
      },
    })
  } catch (error) {
    console.error(error)
    throw error
  }

  return {
    duration: metadata.format.duration,
    meta: {
      name: metadata.common.title,
      artists: normalizeArtist(metadata.common.artists),
      album: metadata.common.album,
      album_artists: normalizeArtist(metadata.common.artist),
      year: metadata.common.year,
      track: metadata.common.track,
      disc: metadata.common.comment,
      genre: metadata.common.genre,
      picture: metadata.common.picture,
    },
    artwork: null,
  }
}
