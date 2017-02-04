let express         = require('express');
let server          = express();
let path            = require('path');
let bodyParser      = require('body-parser');
let cookieParser    = require('cookie-parser');
let busboy          = require('connect-busboy');
let fs              = require('fs');
let hbs             = require('express-handlebars');
let config          = require('../config/config.js');
let env             = process.env.NODE_ENV || 'development'

module.exports.init = function(db, rootFolder) {

    // configure app to use bodyParser()
    // this will let us get the data from a POST
    server.use(bodyParser.urlencoded({ extended: true }));
    server.use(bodyParser.json());
    server.use(cookieParser());
    server.use(busboy());
    server.use(require('express-session')({
        secret: 'qokajdteskah',
        resave: false,
        saveUninitialized: false
    }));

    // Public folder
    let publicFolder = path.join(rootFolder, 'public');
    let options = {
        dotfiles: 'ignore',
        etag: false,
        extensions: ['htm', 'html'],
        index: false
    };

    // Routes
    server.use(express.static(publicFolder, options));

    // Log all requests
    server.use(function(req, res, next) {
        // do loggin    g
        console.log(req.method + ': ' + req.url);
        req.publicFolder = publicFolder;
        next(); // make sure we go to the next routes and don't stop here
    });


    // Add handlebar handling
    server.engine('handlebars', hbs({defaultLayout: 'main'}));
    server.set('view engine', 'handlebars');

    // Check storage
    let privateFileFolderPath = config.file.privateFolderPath;
    let privateFileFolderName = config.file.privateFolderName;
    let publicFileFolderName = config.file.publicFolderName;

    let mkdir = (pPath) => {
        try {
            fs.mkdirSync(pPath);
        } catch (e) {
            if ( e.code != 'EEXIST' ) throw e;
        }
    };

    mkdir(privateFileFolderPath + '/' + privateFileFolderName);
    mkdir(publicFolder + '/' + publicFileFolderName);

    // All API routes
    let routerBuilder = require('../route/index.js');

    routerBuilder.build(db).then(apiRoutes => {
        server.use('/api', apiRoutes);
    }).catch(err => {
        console.log('Failed to create routes', err);
        server.close();
    });

    // Index
    //server.use('/', require('./app/server/server-routes.js'));

    server.use(function(err, req, res, next) {

        let errCode = err.name == 'ApiError' ? err.httpCode : 500;

        if (env == 'development') {
            console.log(errCode, err);
        }

        res.status(errCode).end();
    });


    let port = process.env.PORT || 1337;        // set our port
    server.listen(port);
    console.log('Express started on port ' + port);

    return server;
};