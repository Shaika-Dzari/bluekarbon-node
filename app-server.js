let db = require('./app/init/models.js');
let express = require('./app/init/express.js');
let passport = require('./app/init/passport.js');

// Current folder
let thisFolder = __dirname;

// Init Express
let server = express.init(db, thisFolder);

// Security
passport.init(server);
