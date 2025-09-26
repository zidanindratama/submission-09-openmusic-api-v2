import pg from "pg";
import { v4 as uuidv4 } from "uuid";
import NotFoundError from "../../exceptions/NotFoundError.js";
import AuthorizationError from "../../exceptions/AuthorizationError.js";

const { Pool } = pg;

export default class PlaylistsService {
  constructor(collabService) {
    this._pool = new Pool();
    this._collabService = collabService;
  }

  async addPlaylist(name, owner) {
    const id = `playlist-${uuidv4()}`;
    const res = await this._pool.query(
      "INSERT INTO playlists(id,name,owner) VALUES($1,$2,$3) RETURNING id",
      [id, name, owner]
    );
    return res.rows[0].id;
  }

  async getPlaylists(userId) {
    const res = await this._pool.query(
      `SELECT p.id, p.name, u.username
       FROM playlists p
       JOIN users u ON u.id = p.owner
       LEFT JOIN collaborations c ON c.playlist_id = p.id
       WHERE p.owner = $1 OR c.user_id = $1
       GROUP BY p.id, u.username
       ORDER BY p.name`,
      [userId]
    );
    return res.rows;
  }

  async deletePlaylist(id) {
    const res = await this._pool.query(
      "DELETE FROM playlists WHERE id=$1 RETURNING id",
      [id]
    );
    if (!res.rowCount) throw new NotFoundError("Playlist tidak ditemukan");
  }

  async addSongToPlaylist(playlistId, songId) {
    const id = `ps-${uuidv4()}`;
    await this._pool.query(
      "INSERT INTO playlist_songs(id, playlist_id, song_id) VALUES($1,$2,$3)",
      [id, playlistId, songId]
    );
  }

  async getPlaylistWithSongs(playlistId) {
    const p = await this._pool.query(
      `SELECT p.id, p.name, u.username
       FROM playlists p JOIN users u ON u.id=p.owner WHERE p.id=$1`,
      [playlistId]
    );
    if (!p.rowCount) throw new NotFoundError("Playlist tidak ditemukan");

    const songs = await this._pool.query(
      `SELECT s.id, s.title, s.performer
       FROM playlist_songs ps JOIN songs s ON s.id=ps.song_id
       WHERE ps.playlist_id=$1`,
      [playlistId]
    );
    return { ...p.rows[0], songs: songs.rows };
  }

  async deleteSongFromPlaylist(playlistId, songId) {
    await this._pool.query(
      "DELETE FROM playlist_songs WHERE playlist_id=$1 AND song_id=$2",
      [playlistId, songId]
    );
  }

  async verifyPlaylistOwner(id, owner) {
    const res = await this._pool.query(
      "SELECT owner FROM playlists WHERE id=$1",
      [id]
    );
    if (!res.rowCount) throw new NotFoundError("Playlist tidak ditemukan");
    if (res.rows[0].owner !== owner) {
      throw new AuthorizationError("Anda tidak berhak mengakses resource ini");
    }
  }

  async verifyPlaylistAccess(id, userId) {
    try {
      await this.verifyPlaylistOwner(id, userId);
    } catch (e) {
      if (e instanceof NotFoundError) throw e;
      await this._collabService.verifyCollaborator(id, userId);
    }
  }
}
