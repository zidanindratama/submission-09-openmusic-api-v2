import Joi from 'joi'

export const PostAuthSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required()
})

export const PutAuthSchema = Joi.object({
  refreshToken: Joi.string().required()
})

export const DeleteAuthSchema = PutAuthSchema
