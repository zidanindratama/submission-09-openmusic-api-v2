import Joi from 'joi'

export const SongPayloadSchema = Joi.object({
  title: Joi.string().required(),
  year: Joi.number().integer().min(1900).max(9999).required(),
  performer: Joi.string().required(),
  genre: Joi.string().allow('', null),
  duration: Joi.number().integer().allow(null),
  albumId: Joi.string().allow('', null)
})
