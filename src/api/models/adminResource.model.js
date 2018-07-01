var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var AdminResourceSchema = new Schema({
    label: String,
    type: String, // 0 is normal menu 1 is function menu
    routePath: String, //Routing path
    icon: String, //icon 
    componentPath: String, //Component path
    api: String, // API path
    parentId: String,
    enable: { // is it visible?
        type: Boolean,
        default: true
    },
    sortId: {
        type: Number,
        default: 0
    },
    date: {
        type: Date,
        default: Date.now
    },
    comments: String
});


var AdminResource = mongoose.model("AdminResource", AdminResourceSchema);

module.exports = AdminResource;