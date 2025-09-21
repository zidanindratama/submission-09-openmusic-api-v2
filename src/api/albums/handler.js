import autoBind from 'auto-bind'

export default class AlbumsHandler {
  constructor (service, validator) {
    this._service = service
    this._validator = validator
    autoBind(this)
  }

  async postAlbum (request, h) {
    this._validator.validateAlbumPayload(request.payload)
    const albumId = await this._service.addAlbum(request.payload)
    const res = h.response({ status: 'success', data: { albumId } })
    res.code(201)
    return res
  }

  async getAlbumById (request) {
    const album = await this._service.getAlbumById(request.params.id)
    return { status: 'success', data: { album } }
  }

  async putAlbumById (request) {
    this._validator.validateAlbumPayload(request.payload)
    await this._service.editAlbumById(request.params.id, request.payload)
    return { status: 'success', message: 'Album berhasil diperbarui' }
  }

  async deleteAlbumById (request) {
    await this._service.deleteAlbumById(request.params.id)
    return { status: 'success', message: 'Album berhasil dihapus' }
  }
}
