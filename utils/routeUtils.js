exports.createRoute = app => path => middleWare => routeHandler => {
  app.post(path, [...middleWare], (req, res, next) => {
    routeHandler(req, res, next);
  });
};
