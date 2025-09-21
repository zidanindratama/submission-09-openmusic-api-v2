import InvariantError from '../../exceptions/InvariantError.js'
import { SongPayloadSchema } from './schema.js'

export default {
  validateSongPayload: (payload) => {
    const { error } = SongPayloadSchema.validate(payload)
    if (error) throw new InvariantError(error.message)
  }
}
