const routes = (h) => [
  {
    method: 'GET',
    path: '/playlists/{id}/activities',
    handler: (r) => h.getActivities(r),
    options: { auth: 'openmusic_jwt' }
  }
]
export default routes
