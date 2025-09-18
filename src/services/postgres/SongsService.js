import pg from "pg";
import { v4 as uuidv4 } from "uuid";
import NotFoundError from "../../exceptions/NotFoundError.js";
const { Pool } = pg;

export default class SongsService {
  constructor() {
    this._pool = new Pool();
  }

  async addSong({ title, year, performer, genre, duration, albumId }) {
    const id = `song-${uuidv4()}`;
    const res = await this._pool.query(
      "INSERT INTO songs(id,title,year,performer,genre,duration,album_id) VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING id",
      [
        id,
        title,
        year,
        performer,
        genre ?? null,
        duration ?? null,
        albumId ?? null,
      ]
    );
    return res.rows[0].id;
  }

  async getSongs({ title, performer } = {}) {
    const conditions = [];
    const values = [];
    if (title) {
      values.push(`%${title}%`);
      conditions.push(`LOWER(title) LIKE LOWER($${values.length})`);
    }
    if (performer) {
      values.push(`%${performer}%`);
      conditions.push(`LOWER(performer) LIKE LOWER($${values.length})`);
    }
    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
    const res = await this._pool.query(
      `SELECT id, title, performer FROM songs ${where} ORDER BY title`,
      values
    );
    return res.rows;
  }

  async getSongById(id) {
    const res = await this._pool.query("SELECT * FROM songs WHERE id=$1", [id]);
    if (!res.rowCount) throw new NotFoundError("Lagu tidak ditemukan");
    return res.rows[0];
  }

  async editSongById(id, payload) {
    const { title, year, performer, genre, duration, albumId } = payload;
    const res = await this._pool.query(
      "UPDATE songs SET title=$1, year=$2, performer=$3, genre=$4, duration=$5, album_id=$6 WHERE id=$7 RETURNING id",
      [
        title,
        year,
        performer,
        genre ?? null,
        duration ?? null,
        albumId ?? null,
        id,
      ]
    );
    if (!res.rowCount)
      throw new NotFoundError("Gagal memperbarui lagu. Id tidak ditemukan");
  }

  async deleteSongById(id) {
    const res = await this._pool.query(
      "DELETE FROM songs WHERE id=$1 RETURNING id",
      [id]
    );
    if (!res.rowCount)
      throw new NotFoundError("Gagal menghapus lagu. Id tidak ditemukan");
  }

  async verifySongId(id) {
    const x = await this._pool.query("SELECT id FROM songs WHERE id=$1", [id]);
    if (!x.rowCount) throw new NotFoundError("songId tidak valid");
  }
}
