import routes from './routes.js'
import SongsHandler from './handler.js'

export default {
  name: 'songs',
  register: async (server, { service, validator }) => {
    const handler = new SongsHandler(service, validator)
    server.route(routes(handler))
  }
}
