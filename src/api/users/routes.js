const routes = (handler) => [
  { method: "POST", path: "/users", handler: (r, h) => handler.postUser(r, h) },
];
export default routes;
