let express = require('express');
let Models = require('../entity/index.js');

let router = express.Router();

router.get('/', function(req, res, next) {

    Models.module.findAll().then(mods => {
        res.json(mods);
    }).catch(err => {
        next(err);
    });

});

module.exports = router;