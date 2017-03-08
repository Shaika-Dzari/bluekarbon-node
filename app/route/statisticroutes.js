let express = require('express');
let Models = require('../entity/index.js');
let config = require('../config/config.js');
let authUtils = require('../utils/authutils.js');

let router = express.Router();

router.get('/', function(req, res, next) {

    Models.statistic.findAll().then(sts => {
        let statsStore = {tables: {}};

        sts.forEach(s => {
            statsStore.tables[s.tablename] = statsStore.tables[s.tablename] || [];
            statsStore.tables[s.tablename].push(s);
        });

        res.json(statsStore);
    }).catch(err => {
        next(err);
    });

});


module.exports = router;