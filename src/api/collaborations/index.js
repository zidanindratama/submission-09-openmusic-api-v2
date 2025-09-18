import routes from "./routes.js";
import CollaborationsHandler from "./handler.js";

export default {
  name: "collaborations",
  register: async (
    server,
    { playlistsService, usersService, collaborationsService, validator }
  ) => {
    const handler = new CollaborationsHandler(
      playlistsService,
      usersService,
      collaborationsService,
      validator
    );
    server.route(routes(handler));
  },
};
