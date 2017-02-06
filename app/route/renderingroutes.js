let express = require('express');
let Models = require('../entity/index.js');
let authUtils = require('../utils/authutils.js');
let htmlUtils = require('../utils/htmlutils.js');
let fileUtils = require('../utils/fileutils.js');
let config = require('../config/config.js');
let Page = require('../common/page.js');

let router = express.Router();
let normalize = require('../common/Normalize.js');

// Pipe to index
// router.use(/\/(?!(api|\.css|\.js|\.gif)).*/, function(req, res, next) {
//     console.log('redirecting to index.html...')
//     res.sendFile('index.html', { root: publicFolder });
// });

router.use('/', (req, res, next) => {

    let page = new Page(req, 10);
    let modules = null;
    let blogposts = null;
    let categories = null;

    // Blogpost
    let modulesPromise = Models.module.findAll();
    let blogpostsPromise = Models.message.findAll();
    let categoriesPromise = Models.category.findAll();

    Promise.all([modulesPromise, blogpostsPromise, categoriesPromise]).then(ds => {

        console.log(ds);

        // preloadedState: JSON.stringify(store)
        res.render('basic', {
            page: {title: config.site.title, author: config.site.author}
        });

    }).catch(error=> {
        next(error);
    });


    /*
    let cnt = db.unwrap();

    cnt.task(t=> {
        return t.batch([
            t.any(Module.ALL),
            t.any(Message.ALL_PUBLISHED_BY_NEXTPAGE, pagingParam.merge({moduleid: null})),
            t.any(Category.ALL)
        ]);
    })
    .then(objs=> {
        let store = {};
        if (objs) {

            if (!objs[0]) { // Modules are mandatory
                throw new Error("Unable to load modules.");
            }

            let ms = Module.rebuildModuleObject(objs[0]);
            store.modules = normalize(ms);
            // Build Code idx
            let modulecodes = {};
            store.modules.index.forEach(i => {
                modulecodes[store.modules.items[i].code] = i;
            });
            store.modules.codeindex = modulecodes;

            if (objs[1]) {
                store.messages = normalize(Message.computePrettyUrl(objs[1]), true);

                for (let mid in store.messages.items) {
                    store.messages.items[mid].body = store.messages.items[mid].body.replace(/(?:\r\n|\r|\n)/g, '\\n');
                }

                store.messages.preloaded = true;
            }

            if (objs[2]) {
                store.categories = normalize(objs[2], true);
                store.categories.preloaded = true;
            }

        }


        res.render('basic', {
            page: {title: '4nakama.net - A whisper from my Ghost'},
            preloadedState: JSON.stringify(store)
        });
    })
    .catch(error=> {
        next(error);
    });

    */

});

module.exports = router;