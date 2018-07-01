let log4js = require('log4js');
let fs = require('fs');
let logConfig = require('../../config/logConfig');
let _ = require('lodash');
const SystemOptionLogModel = require("../models").SystemOptionLog;

 
log4js.configure(logConfig);

let errorLogger = log4js.getLogger('errorLogger');
let resLogger = log4js.getLogger('resLogger');

let logUtil = {

    initPath() {
        if (logConfig.baseLogPath) {
            confirmPath(logConfig.baseLogPath)
 
            for (let i = 0; i < logConfig.appenders.length; i++) {
                if (logConfig.appenders[i].path) {
                    confirmPath(logConfig.baseLogPath + logConfig.appenders[i].path);
                }
            }
        }
    },

    h5Error(req, error, resTime) {
        if (req) {
            errorLogger.error(formatError(req, error, 'h5', resTime));
        }
    },

    error(error, req, resTime) {
        if (error) {
            if (typeof (error) == "string") {
                errorLogger.error('***** node server error *****', error);
            } else {
                errorLogger.error(formatError(req, error, 'node', resTime));
            }
        }
    },

    res(ctx, resTime) {
        if (ctx) {
            resLogger.info(formatRes(ctx, resTime));
        }
    },

    info(key, info = '') {
        if (key) {
            resLogger.info(key, info);
        }
    }

};

let confirmPath = function (pathStr) {
    if (!fs.existsSync(pathStr)) {
        fs.mkdirSync(pathStr);
    }
}

 
let formatRes = function (req, resTime) {
    let logText = new String();

 
    logText += "\n" + "*************** response log start ***************" + "\n";

 
    logText += formatReqLog(req, resTime);

 
    logText += "response status: " + req.status + "\n";

 
    logText += "response body: " + "\n" + JSON.stringify(req.body) + "\n";

 
    logText += "*************** response log end ***************" + "\n";

    return logText;

}

 
let formatError = function (req = {}, error = {}, type = 'node', resTime = 0) {
    let logText = new String();
    let err = type === 'h5' ? req.query : error;
 
    logText += "\n" + "***************  " + type + " error log start ***************" + "\n";
 
    if (!_.isEmpty(req)) {
        logText += formatReqLog(req);
    }
    if (type === 'h5') {
 
        if (err.userInfo) {
            logText += "request user info:  " + err.userInfo + "\n";
        }
 
        if (err.pageParams) {
            logText += "request client channel info:  " + err.pageParams + "\n";
        }
 
        if (err.clientInfo) {
            logText += "request mobile info:  " + err.clientInfo + "\n";
        }
 
        logText += "err line: " + err.line + ", col: " + err.col + "\n";
    
        logText += "err message: " + err.msg + "\n";
 
        logText += "err url: " + err.url + "\n";

    } else { // node server
 
        logText += "err name: " + error.name + "\n";
 
        logText += "err message: " + error.message + "\n";
  
        logText += "err stack: " + error.stack + "\n";
    }
  
    logText += "***************  " + type + "  error log end ***************" + "\n";

    let loginLog = new SystemOptionLogModel();
    loginLog.type = type + '-exception';
    loginLog.logs = logText;
    loginLog.save();

    return logText;
};

 
let formatReqLog = function (req) {

    let logText = new String();
    let method = req.method;
     
    logText += "request url: " + req.url + "\n";
     
    logText += "request method: " + method + "\n";
     
    logText += "request client ip:  " + req.ip + "\n";

    return logText;
}




module.exports = logUtil;