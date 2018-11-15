// @flow

import db from '~/db'
import type { File } from '~/types'

export function getAlbumsFromSongs(songs: Array<File>): { [string]: Array<File> } {
  const albums = {}

  songs.forEach(function(song) {
    const { meta } = song
    const albumName = meta && meta.album ? meta.album : 'Unknown'

    let albumSongs = albums[albumName]
    if (!albumSongs) {
      albumSongs = []
      albums[albumName] = albumSongs
    }

    albumSongs.push(song)
  })

  return albums
}

export function getArtistsFromSongs(songs: Array<File>): { [string]: Array<File> } {
  const artists = {}

  songs.forEach(function(song) {
    const { meta } = song
    const artistsArr = []
    if (meta && meta.album_artists.length) {
      meta.album_artists.forEach(artist => {
        artistsArr.push(artist)
      })
    } else {
      artistsArr.push('Unknown')
    }

    artistsArr.forEach(artistName => {
      let artistsSongs = artists[artistName]
      if (!artistsSongs) {
        artistsSongs = []
        artists[artistName] = artistsSongs
      }

      artistsSongs.push(song)
    })
  })

  return artists
}

export function getGenresFromSongs(songs: Array<File>): { [string]: Array<File> } {
  const genres = {}

  songs.forEach(function(song) {
    const { meta } = song
    const genresArr = []
    if (meta && meta.genre && meta.genre.length) {
      meta.genre.forEach(genre => {
        genresArr.push(genre)
      })
    } else {
      genresArr.push('Unknown')
    }

    genresArr.forEach(genre => {
      let genresSongs = genres[genre]
      if (!genresSongs) {
        genresSongs = []
        genres[genre] = genresSongs
      }

      genresSongs.push(song)
    })
  })

  return genres
}

export async function addSongsToPlaylist(songsIds: Array<number>, playlistId: number) {
  const playlist = await db.playlists.get(playlistId)
  const playlistSongs = playlist.songs
  songsIds.forEach(id => {
    if (!playlistSongs.includes(id)) {
      playlistSongs.push(id)
    }
  })
  await db.playlists.update(playlistId, { songs: playlistSongs })
}

export function deleteSongFromPlaylist(playlist: Object, id: number) {
  if (playlist.songs.includes(id)) {
    const index = playlist.songs.indexOf(id)
    playlist.songs.splice(index, 1)
    db.playlists.update(playlist.id, {
      songs: playlist.songs,
    })
  }
}

export function deleteSongsFromLibrary(songsIds: Array<number>) {
  songsIds.forEach(async id => {
    await db.songs.delete(id)
    const dbPlaylists = await db.playlists
      .where('songs')
      .equals(id)
      .distinct()
      .toArray()
    dbPlaylists.forEach(playlist => {
      deleteSongFromPlaylist(playlist, id)
    })
  })
}

export function humanizeDuration(duration: number): string {
  const minutes = Math.floor(duration / 60)
  const seconds = Math.ceil(duration % 60)
    .toString(10)
    .padStart(2, '0')

  return `${minutes}:${seconds}`
}

export function fibonacci(num: number) {
  if (num <= 1) return 1
  return fibonacci(num - 1) + fibonacci(num - 2)
}
