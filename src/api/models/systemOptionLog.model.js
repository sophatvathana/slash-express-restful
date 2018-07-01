var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var moment = require('moment')

var SystemOptionLogSchema = new Schema({
    type: String,  
    date: { type: Date, default: Date.now },
    logs: String
});

SystemOptionLogSchema.statics = {


}

SystemOptionLogSchema.set('toJSON', { getters: true, virtuals: true });
SystemOptionLogSchema.set('toObject', { getters: true, virtuals: true });

SystemOptionLogSchema.path('date').get(function (v) {
    return moment(v).format("YYYY-MM-DD HH:mm:ss");
});

var SystemOptionLog = mongoose.model("SystemOptionLog", SystemOptionLogSchema);

module.exports = SystemOptionLog;

