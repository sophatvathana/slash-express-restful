const Joi = require('joi');

module.exports = {

	updateSettings : {
		body: {
			siteName: Joi.string(),
      siteDomain: Joi.string(),
      siteDiscription: Joi.string(),
      siteKeywords: Joi.string(),
      siteAltKeywords: Joi.string(),
      siteEmailServer: Joi.string(),
      siteEmail: Joi.string().email(),
      registrationNo: Joi.string(),
      databackForderPath: Joi.string(),
      mongodbInstallPath: Joi.string(),
      showImgCode: Joi.string(),
      siteEmailPwd: Joi.string()
    }
	}

}