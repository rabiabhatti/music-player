// @flow

import path from 'path'
import { toNodeReadable } from 'web-streams-node'
import { parseStream } from 'music-metadata'

import type { File, FileArtwork, FileMeta } from '~/types'

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
// TODO: Make this configurable
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

async function parse(song: File, response: Object): Promise<{ duration: number, meta: ?FileMeta, artwork: ?FileArtwork }> {
  const nodeStream = toNodeReadable(response.body)
  const metadata = await parseStream(nodeStream, path.extname(song.filename), {
    path: song.filename,
    loadParser(parser) {
      return parsers[parser]().then(importedParser => new importedParser.default())
    },
  })

  return {
    duration: metadata.format.duration,
    meta: {
      name: metadata.common.title,
      artists: normalizeArtist(metadata.common.artists),
      artists_original: metadata.common.artists,
      album: metadata.common.album,
      album_artists: normalizeArtist(metadata.common.artist),
      album_artists_original: metadata.common.artist,
      year: metadata.common.year,
      track: metadata.common.track,
      disc: metadata.common.comment,
      genre: metadata.common.genre,
      // picture: metadata.common.picture,
      // ^ TODO: Set this in artwork instead
    },
    artwork: null,
  }
}

export { parse }
