import pg from 'pg'
import bcrypt from 'bcrypt'
import InvariantError from '../../exceptions/InvariantError.js'
import AuthenticationError from '../../exceptions/AuthenticationError.js'
import { v4 as uuidv4 } from 'uuid'
const { Pool } = pg

export default class UsersService {
  constructor () {
    this._pool = new Pool()
  }

  async addUser ({ username, password, fullname }) {
    const exists = await this._pool.query(
      'SELECT username FROM users WHERE username=$1',
      [username]
    )
    if (exists.rowCount) throw new InvariantError('Username sudah digunakan')

    const id = `user-${uuidv4()}`
    const hashed = await bcrypt.hash(password, 10)

    const res = await this._pool.query(
      'INSERT INTO users(id,username,password,fullname) VALUES($1,$2,$3,$4) RETURNING id',
      [id, username, hashed, fullname]
    )
    return res.rows[0].id
  }

  async verifyUserCredential (username, password) {
    const res = await this._pool.query(
      'SELECT id, password FROM users WHERE username=$1',
      [username]
    )
    if (!res.rowCount) throw new AuthenticationError('Kredensial tidak valid')
    const { id, password: hash } = res.rows[0]
    const match = await bcrypt.compare(password, hash)
    if (!match) throw new AuthenticationError('Kredensial tidak valid')
    return id
  }
}
