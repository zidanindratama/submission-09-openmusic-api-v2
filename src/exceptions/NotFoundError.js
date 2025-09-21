import ClientError from './ClientError.js'

export default class NotFoundError extends ClientError {
  constructor (message = 'Resource tidak ditemukan') {
    super(message, 404)
    this.name = 'NotFoundError'
  }
}
