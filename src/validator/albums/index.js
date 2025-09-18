import InvariantError from "../../exceptions/InvariantError.js";
import { AlbumPayloadSchema } from "./schema.js";

export default {
  validateAlbumPayload: (payload) => {
    const { error } = AlbumPayloadSchema.validate(payload);
    if (error) throw new InvariantError(error.message);
  },
};
