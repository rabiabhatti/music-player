// @flow

import path from 'path'
import parser from 'id3-meta'
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

export default async function parseMeta(song: File, response: Object): Promise<Object> {
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
  }
  return metadata
}