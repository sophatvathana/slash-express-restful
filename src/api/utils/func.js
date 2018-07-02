const settings = require("../../config/settings");
const shortid = require('shortid');
const _ = require('lodash');
const moment = require('moment');
// const cache = require('./cache')
const logUtil = require('../middlewares/log')
const APIError =  require('./APIError')

var func = {

    setConfirmPassWordEmailTemp: function (res, sysConfigs, name, token) {

        let siteTitle = sysConfigs.siteName;
        var html = '<p>' + res.__("label_sendActiveEmail_text1") + '：' + name + '</p><br/>'
            + '<p>' + res.__("label_sendActiveEmail_text2") + '</p><br/>'
            + '<p><strong>' + siteTitle + '</strong> ' + res.__("label_sendActiveEmail_text2_1") + '</p><br/><br/>'
            + '<p>' + res.__("label_sendActiveEmail_text3") + '</p><br/>'
            + '<a href="' + sysConfigs.siteDomain + '/users/reset_pass?key=' + token + '">' + res.__("label_sendActiveEmail_text4") + '</a><br/>'
            + '<a href="' + sysConfigs.siteDomain + '/users/reset_pass?key=' + token + '">' + sysConfigs.siteDomain + '/users/reset_pass?key=' + token + '</a><br/>'
            + '<p> <strong>' + siteTitle + ' </strong> </p>';
        return html;
    },

    setNoticeToAdminEmailTemp: function (res, sysConfigs, obj) {
        let siteTitle = sysConfigs.siteName;
        var msgDate = moment(obj.date).format('YYYY-MM-DD HH:mm:ss');
        var html = '';
        html += '<h1>Hello world</h1>';
        return html;
    },

    setNoticeToAdminEmailByContactUsTemp: function (res, sysConfigs, obj) {
        let siteTitle = sysConfigs.siteName;
        var msgDate = moment(obj.date).format('YYYY-MM-DD HH:mm:ss');
        var html = '';
        html += res.__("lc_sendEmail_user_notice_title") + '<br/><br/>'
            + res.__("lc_sendEmail_user_success_notice") + '<br/><br/>'
            + res.__("lc_sendEmail_user_notice_Info") + '<br/><br/>'
            + '<strong>' + res.__("label_user_email") + ': </strong>' + obj.email + '<br/><br/>'
            + '<strong>' + res.__("label_user_phoneNum") + ': </strong>' + obj.phoneNum + '<br/><br/>'
            + '<strong>' + res.__("lc_sendEmail_user_content") + ': </strong><br/><br/>' + obj.comments + '<br/><br/>'
        return html;
    },

    setNoticeToUserByContactUsTemp: function (res, sysConfigs, obj) {
        var html = '';
        html += res.__("label_sendActiveEmail_text1") + '，<strong>' + obj.name + '</strong>' + res.__("lc_sendEmail_user_success_notice") + '<br/><br/>';
        return html;
    },

    setNoticeToUserEmailTemp: function (res, sysConfigs, obj) {
        let siteTitle = sysConfigs.siteName;
        var msgDate = moment(obj.date).format('YYYY-MM-DD HH:mm:ss');
        var html = '';
        var targetEmail;
        if (obj.author) {
            targetEmail = obj.author.userName;
        } else if (obj.adminAuthor) {
            targetEmail = obj.adminAuthor.userName;
        }
        html += 'Hello world';
        return html;
    },

    setBugToAdminEmailTemp: function (res, sysConfigs, obj) {
        let siteTitle = sysConfigs.siteName;
        var msgDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
        var html = '';
        html += 'Hello administrator（' + obj.email + ') at ' + msgDate + ' in <strong>' + siteTitle + '</strong> Background module <strong>' + obj.contentFrom + '</strong> Said:<br>' + obj.content;
        return html;
    },

    setNoticeToUserRegSuccess: function (res, sysConfigs, obj) {
        let siteTitle = sysConfigs.siteName;
        var html = '';
        html += obj.userName + ' （' + obj.email + ') ' + res.__("label_sendRegEmail_text1") + '<br><br>'
            + '<p>' + siteTitle + ' ' + res.__("label_sendRegEmail_text3") + '</p><br>'
            + '<p>' + res.__("label_sendRegEmail_text2") + ' ' + res.__("label_sendRegEmail_text4") + ' <a href="' + sysConfigs.siteDomain + '/users/login" target="_blank">' + res.__("label_sendRegEmail_text5") + '</a></p><br><br>';
        return html;
    },

    getNoticeConfig: function (type, value) {
        var noticeObj;
        if (type == 'reg') {
            noticeObj = {
                type: '2',
                systemSender: 'sender',
                title: 'User registration reminder',
                content: 'Add a registered user ' + value,
                action: type
            };
        } else if (type == 'msg') {
            noticeObj = {
                type: '2',
                sender: value.author,
                title: 'User message reminder',
                content: 'user ' + value.author.userName + ' Leave a message for you!',
                action: type
            };
        }
        return noticeObj;
    },
    // check current id
    checkCurrentId(ids) {
        if (!ids) return false;
        let idState = true;
        let idsArr = ids.split(',');
        if (typeof idsArr === "object" && idsArr.length > 0) {
            for (let i = 0; i < idsArr.length; i++) {
                if (!shortid.isValid(idsArr[i])) {
                    idState = false;
                    break;
                }
            }
        } else {
            idState = false;
        }
        return idState;
    },

    renderNoPowerMenus(manageCates, adminPower) {
        let newResources = [], newRootCates = [];
        let rootCates = _.filter(manageCates, (doc) => { return doc.parentId == '0'; });
        let menuCates = _.filter(manageCates, (doc) => { return doc.type == '0' && doc.parentId != '0'; });
        let optionCates = _.filter(manageCates, (doc) => { return doc.type != '0'; });
        if (!_.isEmpty(adminPower)) {
            // sub menu
            for (let i = 0; i < menuCates.length; i++) {
                let resourceObj = JSON.parse(JSON.stringify(menuCates[i]));
                let cateFlag = this.checkNoAllPower(resourceObj._id, optionCates, adminPower);
                if (!cateFlag) {
                    newResources.push(resourceObj);
                }
            }
            // root menu
            for (const cate of rootCates) {
                let fiterSubCates = _.filter(newResources, (doc) => { return doc.parentId == cate._id; });
                if (fiterSubCates.length != 0) {
                    newRootCates.push(cate);
                }
            }
        }
        return newResources.concat(newRootCates);
    },

    // check Submenus have no permission
    checkNoAllPower(resourceId, childCates, power) {
        let cateFlag = true;
        let rootCates = _.filter(childCates, (doc) => {
            return doc.parentId == resourceId
        });
        for (const cate of rootCates) {
            if ((power).indexOf(cate._id) > -1) {
                cateFlag = false;
                break;
            }
        }
        return cateFlag;
    },

    // User exception
    UserException: function (message) {
        this.message = message;
        this.name = "UserException";
    },

    // runder API Data
    renderApiData(res, responseCode, responseMessage, data = {}, type = "getlist") {

        if (type == 'getlist') {
            responseMessage = res.__("validate_error_getSuccess", { success: responseMessage })
        }

        let sendData = {
            status: responseCode,
            message: responseMessage,
            server_time: (new Date()).getTime(),
            data
        }
        res.send(sendData);
    },

    renderApiErr(req, res, responseCode, responseMessage, type = 'save') {
        let stack = {};
        if (responseMessage instanceof APIError){
            stack = responseMessage.stack
        }

        if (typeof responseMessage == 'object') {
            responseMessage = responseMessage.message;
        }

        if (type == 'save') {
            responseMessage = res.__("resdata_savedata_error", { error: responseMessage })
        } else if (type == 'delete') {
            responseMessage = res.__("resdata_deldata_error", { error: responseMessage })
        } else if (type == 'update') {
            responseMessage = res.__("resdata_updatedata_error", { error: responseMessage })
        } else if (type == 'getlist') {
            responseMessage = res.__("resdata_getlist_error", { error: responseMessage })
        } else if (type == 'checkform') {
            responseMessage = res.__("resdata_checkformdata_error", { error: responseMessage })
        }
        let errorData = {
            status: responseCode,
            message: responseMessage,
            server_time: (new Date()).getTime(),
            stack: stack,
            data: {}
        }
        // Error log
        logUtil.error(responseMessage, req);    
        res.statusCode = responseCode;
        res.send(errorData);
    },

    // getSiteLocalKeys(res) {
    //     return new Promise((resolve, reject) => {
    //         cache.get(settings.session_secret + '_localkeys', async (localRenderData) => {
    //             if (!_.isEmpty(localRenderData)) {
    //                 resolve(localRenderData)
    //             } else {
    //                 const targetLocalJson = require('../locales/en.json');
    //                 let renderKeys = [];
    //                 for (let lockey in targetLocalJson) {
    //                     renderKeys[lockey] = res.__(lockey);
    //                 }
    //                 let timeSet = process.env.NODE_ENV === 'production' ? 1000 * 60 * 60 : 1000;
    //                 cache.set(settings.session_secret + '_localkeys', renderKeys, timeSet);
    //                 resolve(renderKeys)
    //             }
    //         })
    //     })
    // },
    renderLocalStr() {
        let str = [' ', '  '];
        if (settings.lang == 'en') {
            str = ['  ', '    ']
        }
        return str;
    },

    getStrLength(str) {
        let charCode = -1;
        const len = str.length;
        let realLength = 0;
        let zhChar = 0, enChar = 0;
        for (let i = 0; i < len; i++) {
            charCode = str.charCodeAt(i)
            if (charCode >= 0 && charCode <= 128) {
                realLength += 1;
                enChar++
            } else {
                realLength += 2;
                zhChar++
            }
        }
        return {
            length: realLength,
            enChar,
            zhChar
        }
    },

    setTempParentId(arr, key) {
        for (var i = 0; i < arr.length; i++) {
            var pathObj = arr[i];
            pathObj.parentId = key;
        }
        return arr;
    },

    getTempBaseFile: function (path) {
        var thisType = (path).split('.')[1];
        var basePath;
        if (thisType == 'html') {
            basePath = settings.SYSTEMTEMPFORDER;
        } else if (thisType == 'json') {
            basePath = process.cwd();
        } else {
            basePath = settings.TEMPSTATICFOLDER;
        }
        return basePath;
    },

    // checkExistFile
    checkExistFile(tempFilelist, forderArr) {

        let filterForderArr = [], distPath = false;
        for (let i = 0; i < forderArr.length; i++) {
            const forder = forderArr[i];
            let currentForder = _.filter(tempFilelist, (fileObj) => {
                return fileObj.name == forder;
            })
            filterForderArr = filterForderArr.concat(currentForder);
        }
        if (filterForderArr.length > 0 && (tempFilelist.length >= forderArr.length) && (filterForderArr.length == tempFilelist.length)) {
            distPath = true;
        }

        return distPath;
    }

};
module.exports = func;