var path = require("path");

exports.init = function (app) {
  var route_Master = path.join(__dirname, "routes", "Announcement");

  var announcement_route = require(route_Master + path.sep + "announcement_route.js");
  app.use("/announcement", announcement_route.init_route());

  var user_route = require(route_Master + path.sep + "user_route.js");
  app.use("/user", user_route.init_route());



};


