import autoBind from "auto-bind";

export default class SongsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
    autoBind(this);
  }

  async postSong(request, h) {
    this._validator.validateSongPayload(request.payload);
    const songId = await this._service.addSong(request.payload);
    const res = h.response({ status: "success", data: { songId } });
    res.code(201);
    return res;
  }

  async getSongs(request) {
    const { title, performer } = request.query;
    const songs = await this._service.getSongs({ title, performer });
    return { status: "success", data: { songs } };
  }

  async getSongById(request) {
    const song = await this._service.getSongById(request.params.id);
    return { status: "success", data: { song } };
  }

  async putSongById(request) {
    this._validator.validateSongPayload(request.payload);
    await this._service.editSongById(request.params.id, request.payload);
    return { status: "success", message: "Lagu berhasil diperbarui" };
  }

  async deleteSongById(request) {
    await this._service.deleteSongById(request.params.id);
    return { status: "success", message: "Lagu berhasil dihapus" };
  }
}
