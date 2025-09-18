import routes from "./routes.js";
import AlbumsHandler from "./handler.js";

export default {
  name: "albums",
  register: async (server, { service, validator }) => {
    const handler = new AlbumsHandler(service, validator);
    server.route(routes(handler));
  },
};
