import ClientError from "./ClientError.js";

export default class AuthenticationError extends ClientError {
  constructor(message = "Authentication gagal") {
    super(message, 401);
  }
}
