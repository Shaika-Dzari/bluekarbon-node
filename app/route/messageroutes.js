let express = require('express');
let Models = require('../entity/index.js');
let authUtils = require('../utils/authutils.js');
let htmlUtils = require('../utils/htmlutils.js');
let Page = require('../common/page.js');

const DEFAULT_PAGE_SIZE = 3;

function build(modid) {
    let router = express.Router();

    /**
     * Get all blogposts.
     */
    // TODO: Pagination
    router.get('/', (req, res, next) => {

        let conds = {
            moduleid: modid,
            published: true
        }

        // Pagination ?
        let page = new Page(req, DEFAULT_PAGE_SIZE);

        Models.message.findAll({where: conds, offset: page.offset(), limit: page.size(), order: 'createdat desc'}).then(ms => {
            return res.json(htmlUtils.computePrettyUrl(ms));
        }).catch(err => {
            console.log(err);
            next(new Error("Error loading message"));
        });
    });

    /**
     * Get one blogpost.
     * Authenticate user can access unpublished blogpost.
     */
    router.get('/:id', (req, res, next) => {

        let conds = {
            id: req.params.id,
            moduleid: modid
        }

        if (!authUtils.isLoggedIn(req)) {
            conds.published = true;
        }

        Models.message.findOne({where: conds}).then(m => {
            return res.json(htmlUtils.computePrettyUrl(m));
        }).catch(err => {
            next(new Error("Error loading message"));
        });

    });


    /**
     * Create new Message.
     */
    router.post('/', authUtils.enforceLoggedIn, function(req, res, next) {

        let user = req.user;
        let msgreq = req.body;

        // Generate html
        let m = {
            title: msgreq.title,
            body: msgreq.body,
            html: htmlUtils.mkToHtml(msgreq.body),
            authorid: user.id,
            authorname: user.username,
            published: !!msgreq.published,
            prettyurl: htmlUtils.sanitizeUrl(msgreq.prettyurl),
            categories: JSON.stringify(msgreq.categories),
            moduleid: modid
        };

        Models.message.create(m).then(dbid => {
            Models.message.findOne({where: {id: dbid}}).then(dbMsg => {
                return res.status(201).json(htmlUtils.computePrettyUrl(dbMsg));
            }).catch(next);
        }).catch(err => {
            next(new Error("Error creating message"));
        });
    });


    /**
     * Update new Message.
     */
    router.put('/:messageid', authUtils.enforceLoggedIn, function(req, res, next) {
        let mid = parseInt(req.params.messageid, 10);
        let upMsg = req.body;
        let originalCategories = upMsg.categories

        upMsg.prettyurl = htmlUtils.sanitizeUrl(upMsg.prettyurl);
        upMsg.published = !!upMsg.published;
        upMsg.categories = upMsg.categories;
        upMsg.html = htmlUtils.mkToHtml(upMsg.body);

        let m = {
            title: upMsg.title,
            body: upMsg.body,
            html: upMsg.html,
            prettyurl: upMsg.prettyurl,
            published: upMsg.published,
            categories: upMsg.categories
        };

        Models.message.update(m, {where: {id: mid}}).then(dbid => {
            Models.message.findOne({where: {id: dbid}}).then(dbMsg => {
                return res.json(htmlUtils.computePrettyUrl(dbMsg));
            }).catch(next);
        }).catch(next);
    });

    return router;
}


module.exports.build = build;