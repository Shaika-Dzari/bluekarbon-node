let express = require('express');
let builder = require('./messageroutes.js');
let categoryRoutes = require('./categoryroutes.js');
let commentRoutes = require('./commentroutes.js');
let fileRoutes = require('./fileroutes.js');
let moduleRoutes = require('./moduleroutes.js');
let statisticRoutes = require('./statisticroutes.js');
let renderingRoutes = require('./renderingroutes.js');


const build = (Model) => {
    // Get Modules
    return new Promise((resolve, reject) => {
        Model.module.findAll().then(ms => {
            let router = express.Router();

            // Create a hash of module
            let mods = {};
            ms.forEach(m => {
                mods[m.code] = m;
            });

            // Dynamic routes
            router.use('/blog/posts', builder.build(mods['BLOG'].id));
            router.use('/about/posts', builder.build(mods['ABOUT'].id));

            // Others routes
            router.use('/categories', categoryRoutes);
            router.use('/comments', commentRoutes);
            router.use('/files', fileRoutes);
            router.use('/statistics', statisticRoutes);
            router.use('/modules', moduleRoutes);

            resolve(router);
        }).catch(err => {
            reject(err);
        })
    });
}

module.exports.build = build;