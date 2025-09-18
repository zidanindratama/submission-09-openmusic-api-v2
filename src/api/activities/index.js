import routes from "./routes.js";
import ActivitiesHandler from "./handler.js";

export default {
  name: "activities",
  register: async (server, { playlistsService, activitiesService }) => {
    const handler = new ActivitiesHandler(playlistsService, activitiesService);
    server.route(routes(handler));
  },
};
