import autoBind from "auto-bind";

export default class UsersHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
    autoBind(this);
  }

  async postUser(request, h) {
    this._validator.validateUserPayload(request.payload);
    const userId = await this._service.addUser(request.payload);
    const res = h.response({ status: "success", data: { userId } });
    res.code(201);
    return res;
  }
}
