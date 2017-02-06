let express = require('express');
let Models = require('../entity/index.js');
let authUtils = require('../utils/authutils.js');
let htmlUtils = require('../utils/htmlutils.js');
let fileUtils = require('../utils/fileutils.js');
let config = require('../config/config.js');
let Page = require('../common/page.js');

const DEFAULT_PAGE_SIZE = 15;
const DEFAULT_MAX_PAGE_SIZE = 30;

let router = express.Router();

router.get('/', function(req, res, next) {

    let user = req.user;
    let page = new Page(req, DEFAULT_PAGE_SIZE);
    let wheres = {};

    if (!user) wheres.ispublic = true;

    Models.file.findAll({where: wheres, offset: page.offset(), limit: page.size(), order: 'createdat desc'}).then(files => {
        res.json(files);
    }).catch(err => {
        next(err);
    });

});

router.post('/', authUtils.enforceLoggedIn, (req, res, next) => {
    var isPublicFile = !req.query.public || req.query.public == 1 ? true : false;
    var fstream;
    var user = req.user;
    var publicFolder = req.publicFolder;
    var publicFileFolderName = config.file.publicFolderName;

    req.pipe(req.busboy);
    req.busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {

        var path = isPublicFile ? publicFolder + '/' + publicFileFolderName : config.file.privateFolder;
        var url = isPublicFile ? '/' + publicFileFolderName : '/api/files/stream';
        console.log("Uploading: ", filename, encoding, mimetype);
        console.log(path);


        FileUtils.uploadTo(file, path, filename, (finalFileName, finalFilePath) => {

            var newFile = { name: filename,
                            filepath: url + '/' + finalFileName,
                            contenttype: mimetype,
                            ownerid: user.id,
                            ownername: user.username,
                            ispublic: isPublicFile};

            // Save virtual file.
            Models.file.create(newFile).then(df => {
                res.json(df);
            }).catch(err => {
                next(err);
            })

        });


    });
});



module.exports = router;