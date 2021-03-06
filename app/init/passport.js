let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;
let hashUtils = require('../utils/hashutils.js');
let Models = require('../entity/index.js');

module.exports.init = function (express) {

    passport.use(new LocalStrategy( (username, password, done) => {

        Models.userinfo.findOne({where: {username: username}}).then(user => {

            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }

            if (!hashUtils.compare(password, user.password)) {
                return done(null, false, { message: 'Incorrect password.' });
            }

            return done(null, user);
        }).catch(err => {
            console.error(err);
            return done(null, false, { message: 'Unexpected error.' });
        });
    }));

    passport.serializeUser((user, done) => {
        let partialUser = {
            id: user.id,
            username: user.username,
            role: user.role,
            displayname: user.displayname
        };
        done(null, partialUser);
    });

    passport.deserializeUser((user, done) => {
        done(null, user);
    });

    // Initialize
    express.use(passport.initialize());
    express.use(passport.session());
}
