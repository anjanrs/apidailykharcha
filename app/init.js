const express = require("express");
const http = require("http");
module.exports = function() {
  if (this.app) return this;
  this.app = new express();
  this.setupMiddlewares(this.app);
  this.setupRoutes();
  this.setupPassport();
  const port = process.env.PORT || 3090;
  const server = http.createServer(this.app);
  server.listen(port);
  console.log("Server listing on port: ", port);
  return this;
};
