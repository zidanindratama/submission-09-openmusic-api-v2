import pg from 'pg'
import { v4 as uuidv4 } from 'uuid'
import NotFoundError from '../../exceptions/NotFoundError.js'
const { Pool } = pg
export default class AlbumsService {
  constructor () {
    this._pool = new Pool()
  }

  async addAlbum ({ name, year }) {
    const id = `album-${uuidv4()}`
    const res = await this._pool.query(
      'INSERT INTO albums(id,name,year) VALUES($1,$2,$3) RETURNING id',
      [id, name, year]
    )
    return res.rows[0].id
  }

  async getAlbumById (id) {
    const album = await this._pool.query(
      'SELECT id, name, year FROM albums WHERE id=$1',
      [id]
    )
    if (!album.rowCount) throw new NotFoundError('Album tidak ditemukan')
    const songs = await this._pool.query(
      'SELECT id, title, performer FROM songs WHERE album_id=$1',
      [id]
    )
    return { ...album.rows[0], songs: songs.rows }
  }

  async editAlbumById (id, { name, year }) {
    const res = await this._pool.query(
      'UPDATE albums SET name=$1, year=$2 WHERE id=$3 RETURNING id',
      [name, year, id]
    )
    if (!res.rowCount) { throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan') }
  }

  async deleteAlbumById (id) {
    const res = await this._pool.query(
      'DELETE FROM albums WHERE id=$1 RETURNING id',
      [id]
    )
    if (!res.rowCount) { throw new NotFoundError('Gagal menghapus album. Id tidak ditemukan') }
  }
}
