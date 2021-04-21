var express = require("express");
var path = require("path");
var connector = require(path.join(__appbase, "config", "connector.js"));
var globals = connector.__globals;
var router = express.Router();

exports.init_route = function () {
    var announcement = require(globals.ROUTE_DIRMASTER + path.sep + "announcement.js");
    router.post("/", announcement.Get);
    router.post("/add", announcement.Add);
    router.put("/update", announcement.Update);
    router.post("/delete", announcement.Delete);
    return router;
};