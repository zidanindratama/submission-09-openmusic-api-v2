import InvariantError from "../../exceptions/InvariantError.js";
import {
  PlaylistPayloadSchema,
  PlaylistSongPayloadSchema,
  CollaborationPayloadSchema,
} from "./schema.js";

export default {
  validatePlaylistPayload: (payload) => {
    const { error } = PlaylistPayloadSchema.validate(payload);
    if (error) throw new InvariantError(error.message);
  },
  validatePlaylistSongPayload: (payload) => {
    const { error } = PlaylistSongPayloadSchema.validate(payload);
    if (error) throw new InvariantError(error.message);
  },
  validateCollaborationPayload: (payload) => {
    const { error } = CollaborationPayloadSchema.validate(payload);
    if (error) throw new InvariantError(error.message);
  },
};
