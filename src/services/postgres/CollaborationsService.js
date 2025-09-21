import pg from 'pg'
import { v4 as uuidv4 } from 'uuid'
import InvariantError from '../../exceptions/InvariantError.js'
import AuthorizationError from '../../exceptions/AuthorizationError.js'
const { Pool } = pg

export default class CollaborationsService {
  constructor () {
    this._pool = new Pool()
  }

  async addCollaboration (playlistId, userId) {
    const id = `collab-${uuidv4()}`
    try {
      const res = await this._pool.query(
        'INSERT INTO collaborations(id, playlist_id, user_id) VALUES($1,$2,$3) RETURNING id',
        [id, playlistId, userId]
      )
      return res.rows[0].id
    } catch (e) {
      throw new InvariantError('Gagal menambahkan kolaborasi')
    }
  }

  async deleteCollaboration (playlistId, userId) {
    await this._pool.query(
      'DELETE FROM collaborations WHERE playlist_id=$1 AND user_id=$2',
      [playlistId, userId]
    )
  }

  async verifyCollaborator (playlistId, userId) {
    const res = await this._pool.query(
      'SELECT id FROM collaborations WHERE playlist_id=$1 AND user_id=$2',
      [playlistId, userId]
    )
    if (!res.rowCount) { throw new AuthorizationError('Anda tidak berhak mengakses resource ini') }
  }
}
