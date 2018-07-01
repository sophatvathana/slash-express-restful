var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AdminGroup = require('./AdminGroup');

var AdminUserSchema = new Schema({
    name: String,
    userName: String,
    password: String,
    email: String,
    phoneNum: Number,
    comments: String,
    date: { type: Date, default: Date.now },
    logo: { type: String, default: "/upload/images/defaultlogo.png" },
    enable: { type: Boolean, default: false },
    auth: { type : Boolean ,default :false},
    group: {
        type: String,
        ref: 'AdminGroup'
    }
});

AdminUserSchema.statics = {

    getOneItem: function (res, targetId, callBack) {
        AdminUser.findOne({ 'id': targetId }).populate('group').exec(function (err, user) {
            if (err) {
                res.end(err);
            }
            callBack(user);
        })
    }

};


var AdminUser = mongoose.model("AdminUser", AdminUserSchema);

module.exports = AdminUser;

