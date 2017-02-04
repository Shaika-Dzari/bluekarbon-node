let express = require('express');
let Models = require('../entity/index.js');
let authUtils = require('../utils/authutils.js');
let htmlUtils = require('../utils/htmlutils.js');

let router = express.Router();

router.get('/', function(req, res, next) {

    let modid = req.query.moduleid;
    let wheres = modid ? {where: {moduleid: modid}} : undefined;

    Models.category.findAll(wheres).then(cs => {
        res.json(cs);
    }).catch(err => {
        next(err);
    });

});

router.post('/', authUtils.enforceLoggedIn, function(req, res, next) {

    let name = req.body.name;
    let desc = req.body.description;
    let moduleid = req.body.moduleid;

    if (!name || !moduleid)
        return next(new Error('Missing name or module id'));

    Models.category.create({name: name, description: desc, moduleid: moduleid}).then(newcat => {
        res.json(newcat);
    }).catch(err => {
        next(err);
    })

});


module.exports = router;