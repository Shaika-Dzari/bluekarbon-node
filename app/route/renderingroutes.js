let express = require('express');
let Models = require('../entity/index.js');
let authUtils = require('../utils/authutils.js');
let htmlUtils = require('../utils/htmlutils.js');
let fileUtils = require('../utils/fileutils.js');
let config = require('../config/config.js');
let Page = require('../common/page.js');
let normalize = require('../common/Normalize.js');

let router = express.Router();

// Pipe to index
// router.use(/\/(?!(api|\.css|\.js|\.gif)).*/, function(req, res, next) {
//     console.log('redirecting to index.html...')
//     res.sendFile('index.html', { root: publicFolder });
// });

router.use(/\/(?!(api|.*\.css|.*\.js|.*\.gif)).*/, (req, res, next) => {
    console.log(req.url + ' redirected to index.html...');

    let page = new Page(req, 10);
    let modules = null;
    let blogposts = null;
    let categories = null;
    let statistics = null;

    // Blogpost
    let modulesPromise = Models.module.findAll();
    let blogpostsPromise = Models.message.findAll({order: 'createdat desc'});
    let categoriesPromise = Models.category.findAll({order: 'name asc'});
    let statsPromise = Models.statistic.findAll();

    Promise.all([modulesPromise, blogpostsPromise, categoriesPromise, statsPromise]).then(ds => {

        let store = {};

        if (ds && ds.length == 4) {

            modules = normalize(ds[0]);
            blogposts = normalize(htmlUtils.computePrettyUrl(ds[1]), true);
            categories = normalize(ds[2], true);
            statistics = ds[3];

            let statsStore = {tables: {}};

            statistics.forEach(s => {
                statsStore.tables[s.tablename] = statsStore.tables[s.tablename] || [];
                statsStore.tables[s.tablename].push(s);
            });

            // Escape to not break json
            /*
            for (let bid in blogposts.items) {
                blogposts.items[bid].body = htmlUtils.escapeCtrlChar(blogposts.items[bid].body);
                blogposts.items[bid].html = htmlUtils.escapeCtrlChar(blogposts.items[bid].html);
            }
            */
            store = {
                modules: modules,
                categories: categories,
                blogposts: blogposts,
                statistics: statsStore
            }

            let modulecodes = {};
            store.modules.index.forEach(i => {
                modulecodes[store.modules.items[i].code] = i;
            });
            store.modules.codeindex = modulecodes;

            for (let s in store) {
                store[s].preloaded = true;
            }
        }

        res.render('basic', {
            page: {title: config.site.title, author: config.site.author},
            preloadedState: htmlUtils.escapeCtrlChar(JSON.stringify(store))
        });

    }).catch(error=> {
        next(error);
    });


});

module.exports = router;