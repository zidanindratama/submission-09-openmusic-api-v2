import routes from './routes.js'
import AuthenticationsHandler from './handler.js'

export default {
  name: 'authentications',
  register: async (
    server,
    { usersService, authService, tokenManager, validator }
  ) => {
    const handler = new AuthenticationsHandler(
      usersService,
      authService,
      tokenManager,
      validator
    )
    server.route(routes(handler))
  }
}
