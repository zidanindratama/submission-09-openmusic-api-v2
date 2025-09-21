import autoBind from 'auto-bind'

export default class PlaylistsHandler {
  constructor (playlistsService, songsService, validator, activitiesService) {
    this._playlistsService = playlistsService
    this._songsService = songsService
    this._validator = validator
    this._activitiesService = activitiesService
    autoBind(this)
  }

  async postPlaylist (request, h) {
    this._validator.validatePlaylistPayload(request.payload)
    const { id: credentialId } = request.auth.credentials
    const playlistId = await this._playlistsService.addPlaylist(
      request.payload.name,
      credentialId
    )
    const res = h.response({ status: 'success', data: { playlistId } })
    res.code(201)
    return res
  }

  async getPlaylists (request) {
    const { id: credentialId } = request.auth.credentials
    const playlists = await this._playlistsService.getPlaylists(credentialId)
    return { status: 'success', data: { playlists } }
  }

  async deletePlaylist (request) {
    const { id } = request.params
    const { id: credentialId } = request.auth.credentials
    await this._playlistsService.verifyPlaylistOwner(id, credentialId)
    await this._playlistsService.deletePlaylist(id)
    return { status: 'success', message: 'Playlist berhasil dihapus' }
  }

  async postSongToPlaylist (request, h) {
    this._validator.validatePlaylistSongPayload(request.payload)
    const { id: playlistId } = request.params
    const { songId } = request.payload
    const { id: credentialId } = request.auth.credentials

    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId)
    await this._songsService.verifySongId(songId)
    await this._playlistsService.addSongToPlaylist(playlistId, songId)
    await this._activitiesService.addActivity({
      playlistId,
      songId,
      userId: credentialId,
      action: 'add'
    })

    const res = h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan ke playlist'
    })
    res.code(201)
    return res
  }

  async getPlaylistSongs (request) {
    const { id: playlistId } = request.params
    const { id: credentialId } = request.auth.credentials
    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId)
    const playlist = await this._playlistsService.getPlaylistWithSongs(
      playlistId
    )
    return { status: 'success', data: { playlist } }
  }

  async deleteSongFromPlaylist (request) {
    this._validator.validatePlaylistSongPayload(request.payload)
    const { id: playlistId } = request.params
    const { songId } = request.payload
    const { id: credentialId } = request.auth.credentials

    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId)
    await this._playlistsService.deleteSongFromPlaylist(playlistId, songId)
    await this._activitiesService.addActivity({
      playlistId,
      songId,
      userId: credentialId,
      action: 'delete'
    })

    return {
      status: 'success',
      message: 'Lagu berhasil dihapus dari playlist'
    }
  }
}
