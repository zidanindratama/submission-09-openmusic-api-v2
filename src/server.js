import Hapi from "@hapi/hapi";
import Jwt from "@hapi/jwt";
import "dotenv/config";

import ClientError from "./exceptions/ClientError.js";

import albums from "./api/albums/index.js";
import songs from "./api/songs/index.js";
import users from "./api/users/index.js";
import authentications from "./api/authentications/index.js";
import playlists from "./api/playlists/index.js";
import collaborations from "./api/collaborations/index.js";
import activities from "./api/activities/index.js";

import container from "./container.js";

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT || 5000,
    host: process.env.HOST || "0.0.0.0",
    routes: { cors: { origin: ["*"] } },
  });

  await server.register(Jwt);
  server.auth.strategy("openmusic_jwt", "jwt", {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: parseInt(process.env.ACCESS_TOKEN_AGE || "3600"),
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: { id: artifacts.decoded.payload.userId },
    }),
  });

  server.ext("onPreResponse", (request, h) => {
    const { response } = request;
    if (response instanceof Error) {
      if (response instanceof ClientError) {
        const res = h.response({ status: "fail", message: response.message });
        res.code(response.statusCode);
        return res;
      }
      if (!response.isServer) return h.continue;
      const res = h.response({
        status: "error",
        message: "terjadi kegagalan pada server kami",
      });
      res.code(500);
      console.error(response);
      return res;
    }
    return h.continue;
  });

  await server.register([
    {
      plugin: albums,
      options: {
        service: container.services.albumsService,
        validator: container.validators.AlbumsValidator,
      },
    },
    {
      plugin: songs,
      options: {
        service: container.services.songsService,
        validator: container.validators.SongsValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: container.services.usersService,
        validator: container.validators.UsersValidator,
      },
    },
    {
      plugin: authentications,
      options: {
        usersService: container.services.usersService,
        authService: container.services.authService,
        tokenManager: container.utils.TokenManager,
        validator: container.validators.AuthValidator,
      },
    },
    {
      plugin: playlists,
      options: {
        playlistsService: container.services.playlistsService,
        songsService: container.services.songsService,
        validator: container.validators.PlaylistsValidator,
        activitiesService: container.services.activitiesService,
      },
    },
    {
      plugin: collaborations,
      options: {
        playlistsService: container.services.playlistsService,
        usersService: container.services.usersService,
        collaborationsService: container.services.collaborationsService,
        validator: container.validators.PlaylistsValidator,
      },
    },
    {
      plugin: activities,
      options: {
        playlistsService: container.services.playlistsService,
        activitiesService: container.services.activitiesService,
      },
    },
  ]);

  for (const r of server.table()) {
    console.log(
      `[ROUTE] ${r.method.toUpperCase()} ${r.path} | auth:`,
      r.settings.auth === false
        ? "false"
        : r.settings.auth?.strategies || "none"
    );
  }
  server.events.on("response", (request) => {
    console.log(
      `[RESP] ${request.method.toUpperCase()} ${request.path} -> ${
        request.response?.statusCode
      }`
    );
  });

  await server.start();
  console.log(`Server running at ${server.info.uri}`);
};

init();
