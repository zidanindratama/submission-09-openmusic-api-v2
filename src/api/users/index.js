import routes from "./routes.js";
import UsersHandler from "./handler.js";

export default {
  name: "users",
  register: async (server, { service, validator }) => {
    const handler = new UsersHandler(service, validator);
    server.route(routes(handler));
  },
};
