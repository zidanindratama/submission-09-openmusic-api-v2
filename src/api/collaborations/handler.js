import autoBind from 'auto-bind'

export default class CollaborationsHandler {
  constructor (
    playlistsService,
    usersService,
    collaborationsService,
    validator
  ) {
    this._playlistsService = playlistsService
    this._usersService = usersService
    this._collaborationsService = collaborationsService
    this._validator = validator
    autoBind(this)
  }

  async postCollaboration (request, h) {
    this._validator.validateCollaborationPayload(request.payload)
    const { playlistId, userId } = request.payload
    const { id: credentialId } = request.auth.credentials
    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId)

    const collaborationId = await this._collaborationsService.addCollaboration(
      playlistId,
      userId
    )
    const res = h.response({ status: 'success', data: { collaborationId } })
    res.code(201)
    return res
  }

  async deleteCollaboration (request) {
    this._validator.validateCollaborationPayload(request.payload)
    const { playlistId, userId } = request.payload
    const { id: credentialId } = request.auth.credentials
    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId)
    await this._collaborationsService.deleteCollaboration(playlistId, userId)
    return { status: 'success', message: 'Kolaborasi dihapus' }
  }
}
