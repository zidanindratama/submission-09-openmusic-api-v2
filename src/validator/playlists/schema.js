import Joi from "joi";

export const PlaylistPayloadSchema = Joi.object({
  name: Joi.string().required(),
});

export const PlaylistSongPayloadSchema = Joi.object({
  songId: Joi.string().required(),
});

export const CollaborationPayloadSchema = Joi.object({
  playlistId: Joi.string().required(),
  userId: Joi.string().required(),
});
