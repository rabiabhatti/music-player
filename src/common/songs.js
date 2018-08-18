// @flow

import db from '~/db'
import type { File } from '~/types'

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

export function getGenresFromSongs(songs: Array<File>): Array<string> {
  const genres = new Set()

  songs.forEach(function(song) {
    const { meta } = song
    if (meta) {
      typeof meta.genre === 'undefined' || meta.genre[0] === ''
        ? genres.add('Unknown')
        : meta.genre.forEach(item => genres.add(item))
    }
  })

  return Array.from(genres)
}

export function getAlbumsFromSongs(songs: Array<File>): Array<string> {
  const albums = new Set()

  songs.forEach(function(song) {
    const { meta } = song
    if (meta) {
      albums.add(meta.album || 'Unknown')
    }
  })

  return Array.from(albums)
}

export async function addSongsToPlaylist(songsIds: Array<number>, playlistId: number) {
  const playlist = await db.playlists.get(playlistId)
  const songs = playlist.songs
  await songsIds.forEach(id => {
    if (!songs.includes(id)) {
      songs.push(id)
    }
  })
  await db.playlists.update(playlistId, { songs: songs })
  return
}

export function deleteSongsFromLibrary(songsIds: Array<number>) {
  songsIds.forEach(async id => {
    await db.songs.delete(id)
  })
}

export function humanizeDuration(duration: number): string {
  const minutes = Math.floor(duration / 60)
  const seconds = Math.ceil(duration % 60)
    .toString(10)
    .padStart(2, '0')

  return `${minutes}:${seconds}`
}
