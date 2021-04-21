var path = require("path");
var connector = require(path.join(__appbase, "config", "connector.js"));
var globals = connector.__globals;
var app_model = connector.app_model;
var User = app_model.User;
var Moment = globals.Moment;
var uniqid = require('uniqid');
var Moment = globals.Moment;
var lodash = globals.lodash;
var navigator = require("navigator");
var uniqid = require('uniqid');
var crypto = require('crypto');
var algorithm = 'aes-256-ctr';
var password = 'MAKV2SPBNI99212';
var ObjectId = require('mongoose').Types.ObjectId;

function encrypt(text) {
    var cipher = crypto.createCipher(algorithm, password)
    var crypted = cipher.update(text, 'utf8', 'hex')
    crypted += cipher.final('hex');
    return crypted;
}

function decrypt(text) {
    var decipher = crypto.createDecipher(algorithm, password)
    var dec = decipher.update(text, 'hex', 'utf8')
    dec += decipher.final('utf8');
    return dec;
}

exports.Get = function (req, res) {
    var isActive = req.body.isActive;
    User.aggregate([
        { $sort: { loginID: 1, createdDate: -1 } }
    ]).then(function (userList) {
        if (userList != null) {
            res.json(globals.createResponse("User List Retrieved Successfully", userList, 200));
        }
        else {
            res.json(globals.createEResponse("Invalid User", 500));
        }
    });
};
exports.GetById = function (req, res) {
    var id = req.body.id;
    User.aggregate([
        { $match: { isActive: true, _id: ObjectId(id) } },
        {
            $project: {
                _id: 1,
                loginID: 1,
                password: 1,
                isActive: 1, createdBy: 1, createdDate: 1, updatedBy: 1, updatedDate: 1
            }
        }
    ]).then(function (userList) {
        if (userList != null) {
            userList.forEach(element => {
                element.password = decrypt(element.password);
            });
            res.json(globals.createResponse("User List Retrieved Successfully", userList, 200));
        }
        else {
            res.json(globals.createEResponse("Invalid User", 500));
        }
    });
};
exports.Add = function (req, res) {
    req.getValidationResult().then(function (result) {
        if (result.isEmpty()) {
            var loginID = req.body.loginID;
            var password = encrypt(req.body.password);
            var createdBy = req.body.createdBy;


            User.count({ loginID: loginID }).then(function (count) {
                if (count > 0) {
                    res.json(globals.createEResponse("Existing User", 422));
                }
                else {
                    var addUser = new User({
                        loginID: loginID,
                        password: password,
                        createdBy: createdBy,
                        createdDate: globals.Moment.utc()
                    });
                    addUser.save(function (err, data) {
                        if (err) {
                            console.log(err);
                            res.json(globals.createEResponse(err.message, 500));
                        }
                        else {
                            res.json(globals.createResponse("User Added Successfully", data, 200));
                        }
                    });
                }
            });
        }
    });
};

exports.Update = function (req, res) {
    req.getValidationResult().then(function (validation_result) {
        if (validation_result.isEmpty()) {
            var r_id = req.body._id;
            var loginID = req.body.loginID;
            var password = encrypt(req.body.password);
            var updatedBy = req.body.updatedBy;

            var updateUser = User.findOneAndUpdate({ _id: r_id, }, {
                $set: {
                    loginID: loginID,
                    password: password,
                    updatedBy: updatedBy,
                    permissions: permissions,
                    updatedDate: globals.Moment.utc()
                }
            }, { new: true }).exec();
            updateUser.then(function (data) {
                if (data != null) {
                    res.json(globals.createResponse("User updated successfully", data, 200));
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

exports.LoginUser = function (req, res) {
    var loginID = req.body.loginID;
    var password = encrypt(req.body.password);

    User.aggregate([
        { $match: { loginID: loginID, password: password } }
    ]).then(function (userList) {
        if (userList.length > 0) {

            res.json(globals.createResponse("User Login Successfully", userList, 200));
        }
        else {
            res.json(globals.createEResponse("Invalid LoginID or Password", 500));
        }
    });
};

exports.Delete = function (req, res) {
    var rID = req.body._id;
    var deleteUser = User.find({ _id: rID }).remove().exec();
    deleteUser.then(function (result) {
        res.json(globals.createResponse("User deleted successfully", result, 200));
    }).catch(function (e) {
        res.json(globals.createEResponse(e.message, 500));
    });
}