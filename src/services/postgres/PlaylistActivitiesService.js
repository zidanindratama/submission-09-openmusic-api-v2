import pg from 'pg'
import { v4 as uuidv4 } from 'uuid'
const { Pool } = pg

export default class PlaylistActivitiesService {
  constructor () {
    this._pool = new Pool()
  }

  async addActivity ({ playlistId, songId, userId, action }) {
    const id = `activity-${uuidv4()}`
    const time = new Date().toISOString()
    await this._pool.query(
      'INSERT INTO playlist_song_activities(id, playlist_id, song_id, user_id, action, time) VALUES($1,$2,$3,$4,$5,$6)',
      [id, playlistId, songId, userId, action, time]
    )
  }

  async getActivities (playlistId) {
    const res = await this._pool.query(
      `SELECT u.username, s.title, a.action, a.time
       FROM playlist_song_activities a
       JOIN users u ON u.id=a.user_id
       JOIN songs s ON s.id=a.song_id
       WHERE a.playlist_id=$1
       ORDER BY a.time ASC`,
      [playlistId]
    )
    return res.rows
  }
}
