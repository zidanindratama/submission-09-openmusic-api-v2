const routes = (h) => [
  {
    method: "POST",
    path: "/playlists",
    handler: (r, resp) => h.postPlaylist(r, resp),
    options: { auth: "openmusic_jwt" },
  },
  {
    method: "GET",
    path: "/playlists",
    handler: (r) => h.getPlaylists(r),
    options: { auth: "openmusic_jwt" },
  },
  {
    method: "DELETE",
    path: "/playlists/{id}",
    handler: (r) => h.deletePlaylist(r),
    options: { auth: "openmusic_jwt" },
  },

  {
    method: "POST",
    path: "/playlists/{id}/songs",
    handler: (r, resp) => h.postSongToPlaylist(r, resp),
    options: { auth: "openmusic_jwt" },
  },
  {
    method: "GET",
    path: "/playlists/{id}/songs",
    handler: (r) => h.getPlaylistSongs(r),
    options: { auth: "openmusic_jwt" },
  },
  {
    method: "DELETE",
    path: "/playlists/{id}/songs",
    handler: (r) => h.deleteSongFromPlaylist(r),
    options: { auth: "openmusic_jwt" },
  },
];
export default routes;
