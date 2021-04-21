var express = require("express");
var path = require("path");
var connector = require(path.join(__appbase, "config", "connector.js"));
var globals = connector.__globals;
var router = express.Router();

exports.init_route = function () {
    var user = require(globals.ROUTE_DIRMASTER + path.sep + "user.js");
    router.post("/login", user.LoginUser);
    router.post("/", user.Get);
    router.post("/add", user.Add);
    router.post("/getById", user.GetById);
    router.put("/update", user.Update);
    router.post("/delete", user.Delete);
    return router;
};