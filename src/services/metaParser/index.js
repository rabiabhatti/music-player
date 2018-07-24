// @flow

import parser from 'id3-meta'

import id3TagIDs from './id3TagIDs'

export default async function metaParser(response: Object): Promise<Object> {
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  const buffer = await response.arrayBuffer()
  const rawMeta = await parser(buffer)

  const audioBuffer = await audioCtx.decodeAudioData(buffer)
  const minutes = parseInt(audioBuffer.duration / 60, 10)
  const seconds = Math.floor(audioBuffer.duration % 60)
  const time = `${minutes}:${seconds}`

  const metadata = Object.keys(rawMeta).reduce(
    (prev, curr, index) => ({ ...prev, [id3TagIDs[curr]]: Object.values(rawMeta)[index].text }),
    {},
  )
  return { metadata, time }
}
