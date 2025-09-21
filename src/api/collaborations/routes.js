const routes = (h) => [
  {
    method: 'POST',
    path: '/collaborations',
    handler: (r, resp) => h.postCollaboration(r, resp),
    options: { auth: 'openmusic_jwt' }
  },
  {
    method: 'DELETE',
    path: '/collaborations',
    handler: (r) => h.deleteCollaboration(r),
    options: { auth: 'openmusic_jwt' }
  }
]
export default routes
