const routes = (handler) => [
  {
    method: 'POST',
    path: '/albums',
    handler: (r, h) => handler.postAlbum(r, h),
    options: { auth: false }
  },
  {
    method: 'GET',
    path: '/albums/{id}',
    handler: (r) => handler.getAlbumById(r),
    options: { auth: false }
  },
  {
    method: 'PUT',
    path: '/albums/{id}',
    handler: (r) => handler.putAlbumById(r),
    options: { auth: false }
  },
  {
    method: 'DELETE',
    path: '/albums/{id}',
    handler: (r) => handler.deleteAlbumById(r),
    options: { auth: false }
  }
]
export default routes
