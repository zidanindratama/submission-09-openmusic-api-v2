const routes = (handler) => [
  {
    method: "POST",
    path: "/songs",
    handler: (r, h) => handler.postSong(r, h),
    options: { auth: false },
  },
  {
    method: "GET",
    path: "/songs",
    handler: (r) => handler.getSongs(r),
    options: { auth: false },
  },
  {
    method: "GET",
    path: "/songs/{id}",
    handler: (r) => handler.getSongById(r),
    options: { auth: false },
  },
  {
    method: "PUT",
    path: "/songs/{id}",
    handler: (r) => handler.putSongById(r),
    options: { auth: false },
  },
  {
    method: "DELETE",
    path: "/songs/{id}",
    handler: (r) => handler.deleteSongById(r),
    options: { auth: false },
  },
];
export default routes;
