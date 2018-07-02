const express = require('express');
const router = express.Router();
router.caseSensitive = true;
router.strict = true
const formidable = require('formidable'),
    util = require('util'),
    fs = require('fs');
 
const {authorize, ADMIN} = require('../../middlewares/auth');
const moment = require('moment');
// let gm = require('gm');
const url = require('url');
const mime = require('../../utils/mime').types;
const service = require('../../utils/service');
 
const settings = require("../../../config/settings");
let checkPathNum = 0;
const dataOptionLog  = require("../../controllers/dataOptionLog.controller");


let uploadToDir = (req, res, dir) => {

}

let confirmPath = (path) => {
    return new Promise(function (resolve, reject) {
        let waitCheck = () => {
            setTimeout(() => {
                if (!fs.existsSync(path)) {
                    if (checkPathNum == 3) {
                        resolve(fs.existsSync(path));
                    } else {
                        checkPathNum++;
                        waitCheck();
                    }
                } else {
                    resolve(fs.existsSync(path));
                }
            }, 200);
        }
        waitCheck();
    })
}

let checkFilePath = async function (path) {
    return await confirmPath(path);
};

/* GET users listing. */
router.post('/upload', function (req, res, next) {
    let params = url.parse(req.url, true);
    let fileType = params.query.type;
    let fileKey = params.query.key;
    let form = new formidable.IncomingForm(),
        files = [],
        fields = [],
        docs = [];
    console.log('start upload');

    let updatePath = "public/upload/images/";
    let newFileName = "";
    form.uploadDir = updatePath;

    form.on('field', function (field, value) {
        fields.push([field, value]);
    }).on('file', function (field, file) {
        files.push([field, file]);
        docs.push(file);
         
        let realFileType = service.getFileMimeType(file.path);
        let contentType = mime[realFileType.fileType] || 'unknown';
        if (contentType == 'unknown') {
            res.end(settings.system_error_imageType);
        }

        let typeKey = "others";
        let thisType = file.name.split('.')[1];
        let date = new Date();
        let ms = moment(date).format('YYYYMMDDHHmmss').toString();

        if (fileType == 'images') {
            typeKey = "img"
        }
        newFileName = typeKey + ms + "." + thisType;

        if (fileType == 'images') {
            if (realFileType.fileType == 'jpg' || realFileType.fileType == 'jpeg' || realFileType.fileType == 'png' || realFileType.fileType == 'gif') {
                fs.rename(file.path, updatePath + newFileName, function (err) {
                    if (err) {
                        console.log(err)
                    }
                })
            } else {
                res.end(settings.system_error_imageType);
            }

        }

    }).on('end', function () {
         
        if (settings.openqn) {
            let localPath = process.cwd() + '/' + updatePath + newFileName;
             
            if (checkFilePath(localPath)) {
                uploadToDir(req, res, 'upload/images/' + newFileName)
            } else {
                res.end(settings.system_error_upload);
            }
        } else {
            res.end('/upload/images/' + newFileName);
        }
    });

    form.parse(req, function (err, fields, files) {
        err && console.log('formidabel error : ' + err);
        console.log('parsing done');
    });
});


router.route('/dataBackList').get(authorize(ADMIN),  dataOptionLog.getDataBakList);
router.route('/backUpData').get(authorize(ADMIN), dataOptionLog.backUpData);

module.exports = router;