var _globals;

module.exports = {
    announceTypeSchema: {},
    init: function (globals) {
        _globals = globals;
        var modelName = _globals.MODEL_LIST.Announcement;
        this.announceTypeSchema = new _globals.Schema({
            subject: { type: String, required: true},
            time: { type: String, required: false },
            expiryDate: { type: Date, required: false},
            location: { type: String, required: false },
            description: { type: String, required: true},
            notifyToArray: { type: Array, required: true },

            isActive: { type: Boolean, required: true, default: true },
            createdBy: { type: String, required: false },
            updatedBy: { type: String, required: false },
            createdDate: { type: Date, default: Date.now },
            updatedDate: { type: Date }
        }, { collection: modelName, autoIndex: false });
        this.announceTypeSchema.index({ _id: 1,});

        var EMP_LIST = [{}, {
            _id: 1,
            subject: 1,
            time: 1,
            expiryDate: 1,
            location: 1,
            description: 1,
            notifyToArray: 1,
            
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
                    "subject": ret.subject,
                    "time": ret.time,
                    "expiryDate": ret.expiryDate,
                    "location": ret.location,
                    "description": ret.description,
                    "notifyToArray": ret.notifyToArray,

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
                    "subject": ret.subject,
                    "time": ret.time,
                    "expiryDate": ret.expiryDate,
                    "location": ret.location,
                    "description": ret.description,
                    "notifyToArray": ret.notifyToArray,

                    "isActive": ret.isActive,
                    "createdBy": ret.createdBy,
                    "createdDate": ret.createdDate,
                    "updatedBy": ret.updatedBy,
                    "updatedDate": ret.updatedDate,
                }
            }
            return output;
        };

        this.announceTypeSchema.set("toJSON", { virtuals: true, getters: false, transform: transform_result });
        this.announceTypeSchema.set("toObject", { virtuals: true, getters: false, transform: transform_result });

        this.announceTypeSchema.statics.checkByActive = function (data, opts, callBack) {
            var cond = { isActive: data.isActive };
            var query = this.findOne(cond);
            _globals.setOpts(query, opts, EMP_LIST);
            query.exec(callBack);
        };

        this.announceTypeSchema.statics.getAll = function (data, opts, callBack) {
            var cond = {};
            var query = this.find(cond);
            _globals.setOpts(query, opts, EMP_LIST);
            query.exec(callBack);
        };

        _globals.mongoose.model(modelName, this.announceTypeSchema);
    }
};
