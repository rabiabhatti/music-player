// @flow

import type { File } from '~/services/types'

export function getArtistsFromSongs(songs: Array<File>): Array<string> {
  const artists = new Set()

  songs.forEach(function(song) {
    const { meta } = song
    if (meta) {
      if (meta.artists.length === 0) {
        artists.add('Unknown')
      }
      meta.artists.forEach(item => artists.add(item))
    }
  })

  return Array.from(artists)
}

export function humanizeDuration(duration: number): string {
  const minutes = Math.floor(duration / 60)
  const seconds = Math.ceil(duration % 60)
    .toString(10)
    .padStart(2, '0')

  return `${minutes}:${seconds}`
}
