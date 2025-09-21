import pg from 'pg'
import InvariantError from '../../exceptions/InvariantError.js'
const { Pool } = pg

export default class AuthenticationsService {
  constructor () {
    this._pool = new Pool()
  }

  async addRefreshToken (token) {
    await this._pool.query('INSERT INTO authentications(token) VALUES($1)', [
      token
    ])
  }

  async verifyRefreshToken (token) {
    const res = await this._pool.query(
      'SELECT token FROM authentications WHERE token=$1',
      [token]
    )
    if (!res.rowCount) throw new InvariantError('Refresh token tidak valid')
  }

  async deleteRefreshToken (token) {
    await this._pool.query('DELETE FROM authentications WHERE token=$1', [
      token
    ])
  }
}
