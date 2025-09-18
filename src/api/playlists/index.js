import routes from "./routes.js";
import PlaylistsHandler from "./handler.js";

export default {
  name: "playlists",
  register: async (
    server,
    { playlistsService, songsService, validator, activitiesService }
  ) => {
    const handler = new PlaylistsHandler(
      playlistsService,
      songsService,
      validator,
      activitiesService
    );
    server.route(routes(handler));
  },
};
