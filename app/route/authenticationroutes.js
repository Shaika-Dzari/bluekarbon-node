let express = require('express');
var passport = require('passport');
let Models = require('../entity/index.js');
let authUtils = require('../utils/authutils.js');

let router = express.Router();

router.post('/login', passport.authenticate('local'), (req, res, next) => {
    res.json(req.user);
});

router.get('/logout', (req, res) => {
    req.logout();
    res.json('ok');
});

router.get('/challenge', authUtils.enforceLoggedIn, (req, res) => {
    res.json(req.user);
});

module.exports = router;