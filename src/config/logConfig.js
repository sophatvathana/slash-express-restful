let path = require('path');
const settings = require('./settings');

let isDevEnv = (process.env.NODE_ENV == 'development' || process.env.NODE_ENV == 'FAT') ? true : false;
let baseLogPath = isDevEnv ? path.resolve(__dirname, '../logs') : settings.SYSTEMLOGPATH;
 
let errorPath = "/error";
 
let errorFileName = "error";
 
let errorLogPath = baseLogPath + errorPath + "/" + errorFileName;
 
let responsePath = "/response";
 
let responseFileName = "response";
 
let responseLogPath = baseLogPath + responsePath + "/" + responseFileName;

module.exports = {
    appenders: {
        //error logs write by hours
        errorLogger: {
            "type": "dateFile",        //log type
            "filename": errorLogPath,  // output location
            "pattern": "-yyyy-MM-dd.log",  //file extension
            "path": errorPath,   //root path,
            "alwaysIncludePattern": true
        },
        resLogger: {
            "type": "dateFile", //log type
            "filename": responseLogPath, // output location
            "path": responsePath, //root path,
            "alwaysIncludePattern": true,
            "pattern": "-yyyy-MM-dd.log" //file extension
        }
    },
    categories: {
        errorLogger: {
            appenders: ["errorLogger"],
            level: "ERROR"
        },
        resLogger: {
            appenders: ["resLogger"],
            level: "ALL"
        },
        default: {
            appenders: ["resLogger"],
            level: "ALL"
        },
    }
};