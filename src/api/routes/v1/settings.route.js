const express = require('express');
const validate = require('express-validation')
const { authorize, ADMIN } = require('../../middlewares/auth');
const siteConfig = require('../../controllers/siteConfig.controller');
const { updateSettings } = require('../../validations/settings.validation');

const router = express.Router();

router.route('/').put(authorize(ADMIN),validate(updateSettings), siteConfig.updateSystemConfig);


module.exports = router;