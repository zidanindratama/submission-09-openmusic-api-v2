const routes = (handler) => [
  {
    method: 'POST',
    path: '/authentications',
    handler: (r, h) => handler.postAuthentication(r, h)
  },
  {
    method: 'PUT',
    path: '/authentications',
    handler: (r) => handler.putAuthentication(r)
  },
  {
    method: 'DELETE',
    path: '/authentications',
    handler: (r) => handler.deleteAuthentication(r)
  }
]
export default routes
