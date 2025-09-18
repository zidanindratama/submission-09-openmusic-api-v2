import autoBind from "auto-bind";

export default class AuthenticationsHandler {
  constructor(usersService, authService, tokenManager, validator) {
    this._usersService = usersService;
    this._authService = authService;
    this._tokenManager = tokenManager;
    this._validator = validator;
    autoBind(this);
  }

  async postAuthentication(request, h) {
    this._validator.validatePost(request.payload);
    const { username, password } = request.payload;
    const id = await this._usersService.verifyUserCredential(
      username,
      password
    );
    const accessToken = this._tokenManager.generateAccessToken({ userId: id });
    const refreshToken = this._tokenManager.generateRefreshToken({
      userId: id,
    });

    await this._authService.addRefreshToken(refreshToken);

    const res = h.response({
      status: "success",
      data: { accessToken, refreshToken },
    });
    res.code(201);
    return res;
  }

  async putAuthentication(request) {
    this._validator.validatePut(request.payload);
    const { refreshToken } = request.payload;
    await this._authService.verifyRefreshToken(refreshToken);
    const { userId } = this._tokenManager.verifyRefreshToken(refreshToken);
    const accessToken = this._tokenManager.generateAccessToken({ userId });
    return { status: "success", data: { accessToken } };
  }

  async deleteAuthentication(request) {
    this._validator.validateDelete(request.payload);
    const { refreshToken } = request.payload;
    await this._authService.verifyRefreshToken(refreshToken);
    await this._authService.deleteRefreshToken(refreshToken);
    return { status: "success", message: "Refresh token berhasil dihapus" };
  }
}
