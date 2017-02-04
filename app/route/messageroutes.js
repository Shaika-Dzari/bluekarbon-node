let express = require('express');
let Models = require('../entity/index.js');
let authUtils = require('../utils/authutils.js');
let htmlUtils = require('../utils/htmlutils.js');

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

        Models.message.findAll({where: conds}).then(ms => {
            return res.json(ms);
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
            return res.json(m);
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

        Model.message.create(m).then(dmMsg => {
            return res.status(201).json(dmMsg);
        }).catch(err => {
            next(new Error("Error creating message"));
        });
    });


    /**
     * Update new Message.
     */
    router.put('/:messageid', authUtils.enforceLoggedIn, function(req, res, next) {
        let id = req.params.messageid;
        let upMsg = req.body;
        let originalCategories = upMsg.categories

        upMsg.prettyurl = htmlutils.sanitizeUrl(upMsg.prettyurl);
        upMsg.published = !!upMsg.published;
        upMsg.id = parseInt(id, 10);
        upMsg.categories = JSON.stringify(upMsg.categories);
        upMsg.html = htmlUtils.mkToHtml(upMsg.body);


        Model.message.update(m).then(dmMsg => {
            return res.json(dmMsg);
        }).catch(err => {
            next(new Error("Error updating message"));
        });
    });

    return router;
}


module.exports.build = build;