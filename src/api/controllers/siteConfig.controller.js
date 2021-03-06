const SystemConfigModel = require('../models').SystemConfig;
const serviceProviders = require('../services/serviceProviders'); 
const formidable = require('formidable');
const { validatorUtil, func } = require('../utils');
const shortid = require('shortid');
const validator = require('validator')
const settings = require('../../config/settings');

function checkFormData(req, res, fields) {
    let errMsg = '';
    if (fields._id && !func.checkCurrentId(fields._id)) {
        errMsg = res.__("validate_error_params");
    }
    if (!fields.siteEmailServer) {
        errMsg = 'Please select system email server!';
    }
    if (!validatorUtil.checkPwd(fields.siteEmailPwd)) {
        errMsg = '6-12 digits, can only contain letters, numbers and underscores!';
    }
    if (!validatorUtil.checkEmail(fields.siteEmail)) {
        errMsg = res.__("validate_inputCorrect", { label: res.__("label_user_email") });
    }
    if (!validator.isLength(fields.siteName, 5, 100)) {
        errMsg = res.__("validate_inputCorrect", { label: res.__("label_sysconfig_site_name") });
    }
    if (!validator.isLength(fields.siteDiscription, 5, 200)) {
        errMsg = res.__("validate_inputCorrect", { label: res.__("label_sysconfig_site_dis") });
    }
    if (!validator.isLength(fields.siteKeywords, 5, 100)) {
        errMsg = res.__("validate_inputCorrect", { label: res.__("label_sysconfig_site_keyWords") });
    }
    if (!validator.isLength(fields.siteAltKeywords, 5, 100)) {
        errMsg = res.__("validate_inputCorrect", { label: res.__("label_sysconfig_site_tags") });
    }
    if (!validator.isLength(fields.registrationNo, 5, 30)) {
        errMsg = res.__("validate_inputCorrect", { label: res.__("label_sysconfig_site_icp") });
    }
    if (!validator.isLength(fields.mongodbInstallPath, 5, 100)) {
        errMsg = res.__("validate_inputCorrect", { label: res.__("label_sysconfig_mongoPath") });
    }
    if (!validator.isLength(fields.databackForderPath, 5, 100)) {
        errMsg = res.__("validate_inputCorrect", { label: res.__("label_sysconfig_databakPath") });
    }
    if (errMsg) {
        throw new func.UserException(errMsg);
    }
}

class SystemConfig {
    constructor() {
        // super()
    }
    async getSystemConfigs(req, res, next) {
        try {
            let modules = req.query.modules;
            let model = req.query.model, files = null;  
            if (model === 'simple') {
                files = {
                    siteName: 1,
                    siteDomain: 1,
                    siteDiscription: 1,
                    siteKeywords: 1,
                    siteAltKeywords: 1,
                    siteEmail: 1,
                    registrationNo: 1,
                    showImgCode: 1
                }
            }
            const systemConfigs = await SystemConfigModel.find({}, files);

            let configData = {
                docs: systemConfigs
            };

            let renderData = func.renderApiData(res, 200, 'systemConfig', configData, 'getlist');

            if (modules && modules.length > 0) {
                return renderData.data.docs;
            } else {
                res.send(renderData);
            }

        } catch (err) {

            res.send(func.renderApiErr(req, res, 500, err, 'getlist'))

        }
    }

    async getConfigsByFiles(files = '') {
        return await SystemConfigModel.find({}, files);
    }

    async createSystemConfig(req, res, next){
        const systemConfig = new SystemConfigModel(req.body)
        const systemConfigSaved = await systemConfig.save()  
    }

    async updateSystemConfig(req, res, next) {
        // const form = new formidable.IncomingForm();
        // console.log(form)
        // form.parse(req, async (err, fields, files) => {
        //     try {
        //         checkFormData(req, res, fields);
        //     } catch (err) {
        //         console.log(err.message, err);
        //         func.renderApiErr(req, res, 500, err, 'checkform');
        //     }
            const fields = req.body
            console.log(fields)

            const systemObj = {
                siteName: fields.siteName,
                siteDomain: fields.siteDomain,
                siteDiscription: fields.siteDiscription,
                siteKeywords: fields.siteKeywords,
                siteAltKeywords: fields.siteAltKeywords,
                siteEmailServer: fields.siteEmailServer,
                siteEmail: fields.siteEmail,
                registrationNo: fields.registrationNo,
                databackForderPath: fields.databackForderPath,
                mongodbInstallPath: fields.mongodbInstallPath,
                showImgCode: fields.showImgCode,
                siteEmailPwd: serviceProviders.encrypt(fields.siteEmailPwd, settings.encrypt_key)
            }
            const item_id = fields._id;
            try {
                if (item_id) {
                    await SystemConfigModel.findOneAndUpdate({ _id: item_id }, { $set: systemObj });
                } else {
                    const newAdminUser = new SystemConfigModel(systemObj);
                    await newAdminUser.save();
                }
                func.renderApiData(res, 200, 'systemConfig', {}, 'update');
            } catch (err) {
                func.renderApiErr(req, res, 500, err, 'update');
            }
        // })

    }

}

module.exports = new SystemConfig();