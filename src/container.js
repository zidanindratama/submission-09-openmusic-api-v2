import AlbumsService from "./services/postgres/AlbumsService.js";
import SongsService from "./services/postgres/SongsService.js";
import UsersService from "./services/postgres/UsersService.js";
import AuthenticationsService from "./services/postgres/AuthenticationsService.js";
import PlaylistsService from "./services/postgres/PlaylistsService.js";
import CollaborationsService from "./services/postgres/CollaborationsService.js";
import PlaylistActivitiesService from "./services/postgres/PlaylistActivitiesService.js";

import AlbumsValidator from "./validator/albums/index.js";
import SongsValidator from "./validator/songs/index.js";
import UsersValidator from "./validator/users/index.js";
import AuthValidator from "./validator/authentications/index.js";
import PlaylistsValidator from "./validator/playlists/index.js";

import TokenManager from "./tokenize/TokenManager.js";

const collaborationsService = new CollaborationsService();
const albumsService = new AlbumsService();
const songsService = new SongsService();
const usersService = new UsersService();
const authService = new AuthenticationsService();
const playlistsService = new PlaylistsService(collaborationsService);
const activitiesService = new PlaylistActivitiesService();

const container = {
  services: {
    albumsService,
    songsService,
    usersService,
    authService,
    playlistsService,
    collaborationsService,
    activitiesService,
  },
  validators: {
    AlbumsValidator,
    SongsValidator,
    UsersValidator,
    AuthValidator,
    PlaylistsValidator,
  },
  utils: {
    TokenManager,
  },
};

export default container;
