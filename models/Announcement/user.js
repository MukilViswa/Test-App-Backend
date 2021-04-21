var _globals;

module.exports = {
    userSchema: {},
    init: function (globals) {
        _globals = globals;
        var modelName = _globals.MODEL_LIST.User;
        this.userSchema = new _globals.Schema({
            loginID: { type: String, required: true},
            password: { type: String, required: false },

            isActive: { type: Boolean, required: true, default: true },
            createdBy: { type: String, required: false },
            updatedBy: { type: String, required: false },
            createdDate: { type: Date, default: Date.now },
            updatedDate: { type: Date }
        }, { collection: modelName, autoIndex: false });
        this.userSchema.index({ _id: 1,});

        var EMP_LIST = [{}, {
            _id: 1,
            loginID: 1,
            password: 1,

            
            isActive: 1, createdBy: 1, createdDate: 1, updatedBy: 1, updatedDate: 1,
        }, { _id: 1 }];

        var transform_result = function (doc, ret, options) {
            var output = {};
            if (typeof doc.ownerDocument == "function") {
                return;
            }
            var index = -1;
            if (options.selector) {
                index = options.selector;
            }
            if (index == 1) {
                output = {
                    "_id": ret._id,
                    "loginID": ret.loginID,
                    "password": ret.password,


                    "isActive": ret.isActive,
                    "createdBy": ret.createdBy,
                    "createdDate": ret.createdDate,
                    "updatedBy": ret.updatedBy,
                    "updatedDate": ret.updatedDate,
                }
            }
            else {
                output = {
                    "_id": ret._id,
                    "loginID": ret.loginID,
                    "password": ret.password,

                    "isActive": ret.isActive,
                    "createdBy": ret.createdBy,
                    "createdDate": ret.createdDate,
                    "updatedBy": ret.updatedBy,
                    "updatedDate": ret.updatedDate,
                }
            }
            return output;
        };

        this.userSchema.set("toJSON", { virtuals: true, getters: false, transform: transform_result });
        this.userSchema.set("toObject", { virtuals: true, getters: false, transform: transform_result });

        this.userSchema.statics.checkByActive = function (data, opts, callBack) {
            var cond = { isActive: data.isActive };
            var query = this.findOne(cond);
            _globals.setOpts(query, opts, EMP_LIST);
            query.exec(callBack);
        };

        this.userSchema.statics.getAll = function (data, opts, callBack) {
            var cond = {};
            var query = this.find(cond);
            _globals.setOpts(query, opts, EMP_LIST);
            query.exec(callBack);
        };

        _globals.mongoose.model(modelName, this.userSchema);
    }
};