import autoBind from 'auto-bind'

export default class ActivitiesHandler {
  constructor (playlistsService, activitiesService) {
    this._playlistsService = playlistsService
    this._activitiesService = activitiesService
    autoBind(this)
  }

  async getActivities (request) {
    const { id: playlistId } = request.params
    const { id: credentialId } = request.auth.credentials
    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId)
    const activities = await this._activitiesService.getActivities(playlistId)
    return { status: 'success', data: { playlistId, activities } }
  }
}
