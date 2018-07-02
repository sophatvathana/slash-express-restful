let nodemailer = require("nodemailer");
 
let fs = require('fs');
let url = require('url');
let stat = fs.stat;
 
// let service = require("./service");
let crypto = require("crypto");
 
// let DataOptionLog = require("../models/DataOptionLog");
 
let moment = require('moment');
 
let settings = require("../../config/settings");
let func = require("../utils/func");

 
let child = require('child_process');
let archiver = require('archiver');
let formidable = require('formidable')
let mime = require('../utils/mime').types;
let iconv = require('iconv-lite');
let systemService = {

    sendEmail: function (req, res, sysConfigs, key, obj, callBack = () => { }) {

        let emailTitle = "Hello";
        let emailSubject = "Hello";
        let emailContent = "Hello";
        let toEmail;
        if (key == settings.email_findPsd) {
            toEmail = obj.email;
            let oldLink = obj.password + '$' + obj.email + '$' + settings.session_secret;
            let newLink = systemService.encrypt(oldLink, settings.encrypt_key);

            emailSubject = emailTitle = '[' + sysConfigs.siteName + '] ' + res.__("label_sendEmail_activePwd_title");
            emailContent = func.setConfirmPassWordEmailTemp(res, sysConfigs, obj.userName, newLink);
        } else if (key == settings.email_notice_contentMsg) {
            emailSubject = emailTitle = '[' + sysConfigs.siteName + '] ' + res.__("label_sendEmail_recieveMsg_title");
            emailContent = func.setNoticeToAdminEmailTemp(res, sysConfigs, obj);
            toEmail = sysConfigs.siteEmail;
        } else if (key == settings.email_notice_admin_byContactUs) {
            emailSubject = emailTitle = '[' + sysConfigs.siteName + '] ' + res.__("label_sendEmail_recieveMsg_title");
            emailContent = func.setNoticeToAdminEmailByContactUsTemp(res, sysConfigs, obj);
            toEmail = sysConfigs.siteEmail;
        } else if (key == settings.email_notice_user_contentMsg) {
            emailSubject = emailTitle = '[' + sysConfigs.siteName + '] ' + res.__("label_sendEmail_notice_haveMsg");
            emailContent = func.setNoticeToUserEmailTemp(res, sysConfigs, obj);
            toEmail = obj.replyAuthor.email;
        } else if (key == settings.email_notice_contentBug) {
            emailSubject = emailTitle = '[' + sysConfigs.siteName + '] ' + res.__("label_sendEmail_notice_askBug");
            emailContent = func.setBugToAdminEmailTemp(res, sysConfigs, obj);
            toEmail = sysConfigs.siteEmail;
        } else if (key == settings.email_notice_user_reg) {
            emailSubject = emailTitle = '[' + sysConfigs.siteName + '] ' + res.__("label_sendEmail_notice_reg_success");
            emailContent = func.setNoticeToUserRegSuccess(res, sysConfigs, obj);
            toEmail = obj.email;
        } else if (key == settings.email_notice_user_byContactUs) {
            emailSubject = emailTitle = '[' + sysConfigs.siteName + '] ' + res.__("label_sendEmail_noticeuser_askInfo_success");
            emailContent = func.setNoticeToAdminEmailByContactUsTemp(res, sysConfigs, obj);
            toEmail = obj.email;
        }

        
        let transporter = nodemailer.createTransport({

            service: sysConfigs.siteEmailServer,
            auth: {
                user: sysConfigs.siteEmail,
                pass: systemService.decrypt(sysConfigs.siteEmailPwd, settings.encrypt_key)
            }

        });

        let mailOptions = {
            from: sysConfigs.siteEmail, // sender address
            to: toEmail, // list of receivers
            subject: emailSubject, // Subject line
            text: emailTitle, // plaintext body
            html: emailContent // html body
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log('-----Failed to send mail:-----' + error);
                callBack('notCurrentEmail');
            } else {
                console.log('Message sent: ' + info.response);
                callBack();
            }
        });


    },
    scanFolder: function (basePath, path) {  
         
        let oldPath = path;
        let filesList = [];

        let fileList = [],
            folderList = [],
            walk = function (path, fileList, folderList) {
                files = fs.readdirSync(basePath + path);
                files.forEach(function (item) {

                    let tmpPath = basePath + path + '/' + item,
                        relativePath = path + '/' + item,
                        stats = fs.statSync(tmpPath);
                    let typeKey = "folder";
                    if (oldPath === path) {
                        if (stats.isDirectory()) {
                            walk(relativePath, fileList, folderList);
                        } else {
                            let fileType = item.split('.')[1];

                            if (fileType) {
                                let ltype = fileType.toLowerCase();
                                if (ltype.indexOf("jpg") >= 0 ||
                                    ltype.indexOf("gif") >= 0 ||
                                    ltype.indexOf("png") >= 0 ||
                                    ltype.indexOf("pdf") >= 0) {
                                    typeKey = "image";
                                } else if (ltype.indexOf("htm") >= 0) {
                                    typeKey = "html";
                                } else if (ltype.indexOf("js") == 0) {
                                    typeKey = "js";
                                } else if (ltype.indexOf("ejs") == 0) {
                                    typeKey = "ejs";
                                } else if (ltype.indexOf("css") >= 0) {
                                    typeKey = "css";
                                } else if (ltype.indexOf("txt") >= 0) {
                                    typeKey = "txt";
                                } else if (ltype.indexOf("mp4") >= 0 ||
                                    ltype.indexOf("mp3") >= 0) {
                                    typeKey = "video";
                                } else {
                                    typeKey = "others";
                                }
                            }
                        }

                        let fileInfo = {
                            "name": item,
                            "type": typeKey,
                            "path": relativePath,
                            "size": stats.size,
                            "date": stats.mtime
                        };
                         
                        item.split('.')[0] && filesList.push(fileInfo);

                    }
                });
            };

        walk(path, fileList, folderList);
        

        return filesList;
    },
    scanJustFolder: function (path) {  
        let folderList = [];

        let files = fs.readdirSync(path);
        files.forEach(function (item) {

            let tmpPath = path + '/' + item,
                stats = fs.statSync(tmpPath);
            if (stats.isDirectory()) {
                let fileInfo = {
                    "name": item,
                    "type": "folder",
                    "size": stats.size,
                    "date": stats.mtime
                };
                folderList.push(fileInfo);
            }
        });

        return folderList;
    },
    deleteFolder: function (req, res, path) {
        // console.log("---del path--" + path);
        return new Promise((resolve, reject) => {
            let files = [];
            if (fs.existsSync(path)) {
                // console.log("---begin to del--");
                if (fs.statSync(path).isDirectory()) {
                    let walk = function (path) {
                        files = fs.readdirSync(path);
                        files.forEach(function (file, index) {
                            let curPath = path + "/" + file;
                            if (fs.statSync(curPath).isDirectory()) { // recurse
                                walk(curPath);
                            } else { // delete file
                                fs.unlinkSync(curPath);
                            }
                        });
                        fs.rmdirSync(path);
                    };
                    walk(path);
                    // console.log("---del folder success----");
                    resolve();
                } else {
                    fs.unlink(path, function (err) {
                        if (err) {
                            console.log(err)
                        } else {
                            // console.log('del file success');
                            resolve();
                        }
                    });
                }

            } else {
                resolve();
            }
        })
    },
    reNameFile: function (req, res, path, newPath) {
        if (fs.existsSync(path)) {

            fs.rename(path, newPath, function (err) {
                if (err) {
                    console.log("Rename failed!");
                    res.end("error");
                } else {
                    console.log("Renamed successfully!");
                    res.end("success");
                }
            });

        }

    },
    readFile: function (req, res, path) {  
        return new Promise((resolve, reject) => {
            if (fs.existsSync(path)) {
                fs.readFile(path, "binary", function (error, data) {
                    if (error) {
                        console.log(err)
                        reject(err);
                    } else {
                         
                        let buf = new Buffer(data, 'binary');
                        let newData = iconv.decode(buf, 'utf-8');
                        resolve(newData);
                    }
                });
            } else {
                reject(settings.system_illegal_param);
            }
        })
    },
    writeFile: function (req, res, path, content, cb) {
        if (fs.existsSync(path)) {
             
            let newContent = iconv.encode(content, 'utf-8');
            fs.writeFileSync(path, newContent);
            return 200;
        } else {
            return 500;
        }
    },

    copyForder: function (fromPath, toPath) {

        let copy = function (src, dst) {
             
            fs.readdir(src, function (err, paths) {
                if (err) {
                    throw err;
                }

                paths.forEach(function (path) {
                    let _src = src + '/' + path,
                        _dst = dst + '/' + path,
                        readable, writable;
                    stat(_src, function (err, st) {
                        if (err) {
                            throw err;
                        }
                         
                        if (st.isFile()) {
                             
                            readable = fs.createReadStream(_src);
                            
                            writable = fs.createWriteStream(_dst);
                             
                            readable.pipe(writable);
                        }
                         
                        else if (st.isDirectory()) {
                            exists(_src, _dst, copy);
                        }
                    });
                });
            });
        };

        
        let exists = function (src, dst, callback) {
            fs.exists(dst, function (exists) {
                 
                if (exists) {
                    callback(src, dst);
                }

                 
                else {
                    fs.mkdir(dst, function () {
                        callback(src, dst);
                    });
                }
            });
        };

         
        exists(fromPath, toPath, copy);
    },

     
    getFileMimeType: function (filePath) {
        let buffer = new Buffer(8);
        let fd = fs.openSync(filePath, 'r');
        fs.readSync(fd, buffer, 0, 8, 0);
        let newBuf = buffer.slice(0, 4);
        let head_1 = newBuf[0].toString(16);
        let head_2 = newBuf[1].toString(16);
        let head_3 = newBuf[2].toString(16);
        let head_4 = newBuf[3].toString(16);
        let typeCode = head_1 + head_2 + head_3 + head_4;
        let filetype = '';
        let mimetype;
        switch (typeCode) {
            case 'ffd8ffe1':
                filetype = 'jpg';
                mimetype = ['image/jpeg', 'image/pjpeg'];
                break;
            case 'ffd8ffe0':
                filetype = 'jpg';
                mimetype = ['image/jpeg', 'image/pjpeg'];
                break;
            case 'ffd8ffdb':
                filetype = 'jpg';
                mimetype = ['image/jpeg', 'image/pjpeg'];
                break;
            case '47494638':
                filetype = 'gif';
                mimetype = 'image/gif';
                break;
            case '89504e47':
                filetype = 'png';
                mimetype = ['image/png', 'image/x-png'];
                break;
            case '504b34':
                filetype = 'zip';
                mimetype = ['application/x-zip', 'application/zip', 'application/x-zip-compressed'];
                break;
            case '2f2aae5':
                filetype = 'js';
                mimetype = 'application/x-javascript';
                break;
            case '2f2ae585':
                filetype = 'css';
                mimetype = 'text/css';
                break;
            case '5b7bda':
                filetype = 'json';
                mimetype = ['application/json', 'text/json'];
                break;
            case '3c212d2d':
                filetype = 'ejs';
                mimetype = 'text/html';
                break;
            default:
                filetype = 'unknown';
                break;
        }

        fs.closeSync(fd);

        return {
            fileType: filetype,
            mimeType: mimetype
        };

    },

    uploadTemp: function (req, res, callBack) {
        let form = new formidable.IncomingForm(),
            files = [],
            fields = [],
            docs = [];
         
        let forderName;
        form.uploadDir = 'views/web/temp/';

        form.parse(req, function (err, fields, files) {
            if (err) {
                res.end(err);
            } else {
                fs.rename(files.Filedata.path, 'views/web/temp/' + files.Filedata.name, function (err1) {
                    if (err1) {
                        res.end(err1);
                    } else {

                        forderName = files.Filedata.name.split('.')[0];
                        console.log('parsing done');
                        callBack(forderName);
                    }
                });
            }

        });
    },

    encrypt: function (data, key) {  
        let cipher = crypto.createCipher("bf", key);
        let newPsd = "";
        newPsd += cipher.update(data, "utf8", "hex");
        newPsd += cipher.final("hex");
        return newPsd;
    },

    decrypt: function (data, key) {  
        let decipher = crypto.createDecipher("bf", key);
        let oldPsd = "";
        oldPsd += decipher.update(data, "hex", "utf8");
        oldPsd += decipher.final("utf8");
        return oldPsd;
    },

    getKeyArrByTokenId: function (tokenId) {
        var newLink = this.decrypt(tokenId, settings.encrypt_key);
        var keyArr = newLink.split('$');
        return keyArr;
    }

};



module.exports = systemService;