const validator = require("validator");

module.exports = {

    validateWords(str) {
        let pattern = new RegExp("[<>#$%^*+*]");
        let newParams = "";
        for (let i = 0; i < str.length; i++) {
            newParams += str.substr(i, 1).replace(pattern, '');
        }
        return newParams;
    },
 
    checkUserName(str) {
        return /^[a-zA-Z][a-zA-Z0-9_]{4,11}$/.test(str);
    },
 
    checkName(str, min = 2, max = 6) {
        return str && validator.isLength(str, min, max) && /[\u4e00-\u9fa5]/.test(str);
    },
 
    checkPwd(str, min = 6, max = 32) {
        return str && validator.isLength(str, 5, max) && /(?!^\\d+$)(?!^[a-zA-Z]+$)(?!^[_#@]+$).{6,}/.test(str);
    },
 
    checkEmail(str) {
        return str && validator.isEmail(str);
    },
 
    checkPhoneNum(str) {
        return str && validator.isMobilePhone(str.toString(), 'zh-CN');
    },

    checkUrl(str) {
        return str && validator.isURL(str);
    }

}