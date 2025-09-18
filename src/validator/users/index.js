import InvariantError from "../../exceptions/InvariantError.js";
import { UserPayloadSchema } from "./schema.js";

export default {
  validateUserPayload: (payload) => {
    const { error } = UserPayloadSchema.validate(payload);
    if (error) throw new InvariantError(error.message);
  },
};
