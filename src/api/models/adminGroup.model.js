var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var AdminResource = require('./AdminResource');

var AdminGroupSchema = new Schema({
    name: String,
    power: [{
        type: String,
        ref: "AdminResource"
    }],
    date: {
        type: Date,
        default: Date.now
    },
    comments: String
});


var AdminGroup = mongoose.model("AdminGroup", AdminGroupSchema);

module.exports = AdminGroup;