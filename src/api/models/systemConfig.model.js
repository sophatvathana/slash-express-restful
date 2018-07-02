var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SystemConfigSchema = new Schema({
    date: { type: Date, default: Date.now },
    siteName: { type: String, default: 'sitename' },
    siteDomain: { type: String, default: 'url' },
    siteDiscription: { type: String, default: 'disc' },
    siteKeywords: String,
    siteAltKeywords: String,  
    siteEmailServer: String,
    siteEmail: String,
    siteEmailPwd: String,
    registrationNo: { type: String, default: '' },
    mongodbInstallPath: {type: String, default: ''},
    databackForderPath: String,
    showImgCode: { type: Boolean, default: false }
});

var SystemConfig = mongoose.model("SystemConfig", SystemConfigSchema);

module.exports = SystemConfig;

