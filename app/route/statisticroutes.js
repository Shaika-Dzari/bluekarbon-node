let express = require('express');
let Models = require('../entity/index.js');
let config = require('../config/config.js');
let authUtils = require('../utils/authutils.js');

let router = express.Router();

router.get('/', authUtils.enforceLoggedIn, function(req, res, next) {

    Models.statistic.findAll().then(sts => {
        res.json(sts);
    }).catch(err => {
        next(err);
    });

});


module.exports = router;