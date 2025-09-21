import InvariantError from '../../exceptions/InvariantError.js'
import { PostAuthSchema, PutAuthSchema, DeleteAuthSchema } from './schema.js'

export default {
  validatePost: (payload) => {
    const { error } = PostAuthSchema.validate(payload)
    if (error) throw new InvariantError(error.message)
  },
  validatePut: (payload) => {
    const { error } = PutAuthSchema.validate(payload)
    if (error) throw new InvariantError(error.message)
  },
  validateDelete: (payload) => {
    const { error } = DeleteAuthSchema.validate(payload)
    if (error) throw new InvariantError(error.message)
  }
}
