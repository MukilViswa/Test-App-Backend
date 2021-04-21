var path = require("path");
var connector = require(path.join(__appbase, "config", "connector.js"));
var globals = connector.__globals;
var app_model = connector.app_model;
var Announcement = app_model.Announcement;
var Moment = globals.Moment;
var uniqid = require('uniqid');
var ObjectId = require('mongoose').Types.ObjectId;

exports.Get = function (req, res) {
    var isActive = req.body.isActive;
    Announcement.aggregate([
        { $match: { isActive: true } },
        { $sort: {  createdDate: -1 } }
    ]).then(function (accessoryTypeList) {
        if (accessoryTypeList != null) {
            res.json(globals.createResponse("Announcement List Retrieved Successfully", accessoryTypeList, 200));
        }
        else {
            res.json(globals.createEResponse("Invalid Announcement", 500));
        }
    });
};

exports.Add = function (req, res) {
    req.getValidationResult().then(function (result) {
        if (result.isEmpty()) {
            var subject = req.body.subject;
            var time = req.body.time;
            var expiryDate = req.body.expiryDate;
            var location = req.body.location;
            var notifyToArray = req.body.notifyToArray;
            var description = req.body.description;
            var createdBy = req.body.createdBy;

            var addAccessoryType = new Announcement({
                subject: subject,
                time: time,
                expiryDate: expiryDate,
                location: location,
                notifyToArray: notifyToArray,
                description: description,
                createdBy: createdBy,
                createdDate: globals.Moment.utc()
            });
            addAccessoryType.save(function (err, data) {
                if (err) {
                    console.log(err);
                    res.json(globals.createEResponse(err.message, 500));
                }
                else {
                    res.json(globals.createResponse("Announcement Added Successfully", data, 200));
                }
            });

        }
    });
};

exports.Update = function (req, res) {
    req.getValidationResult().then(function (validation_result) {
        if (validation_result.isEmpty()) {
            var r_id = req.body._id;
            var subject = req.body.subject;
            var time = req.body.time;
            var expiryDate = req.body.expiryDate;
            var location = req.body.location;
            var notifyToArray = req.body.notifyToArray;
            var description = req.body.description;
            var updatedBy = req.body.updatedBy;

            var updateAccessoryType = Announcement.findOneAndUpdate({ _id: r_id, }, {
                $set: {
                    subject: subject,
                    time: time,
                    expiryDate: expiryDate,
                    location: location,
                    notifyToArray: notifyToArray,
                    description: description,
                    updatedBy: updatedBy,
                    updatedDate: globals.Moment.utc()
                }
            }, { new: true }).exec();
            updateAccessoryType.then(function (data) {
                if (data != null) {
                    res.json(globals.createResponse("Announcement updated successfully", data, 200));
                }
                else {
                    res.json(globals.createEResponse("Failed to Update", 500));
                }
            })
        }
        else {
            res.json(globals.createEResponse(result.array()[0].msg, 422));
        }
    }).catch(function (e) {
        res.json(globals.createEResponse(e.message, 500));
    });
};

exports.Delete = function (req, res) {
    var rID = req.body._id;
    var deleteAccessoryType = Announcement.find({ _id: rID }).remove().exec();
    deleteAccessoryType.then(function (result) {
        res.json(globals.createResponse("Announcement deleted successfully", result, 200));
    }).catch(function (e) {
        res.json(globals.createEResponse(e.message, 500));
    });
}