let express = require('express');
let Models = require('../entity/index.js');
let authUtils = require('../utils/authutils.js');
let htmlUtils = require('../utils/htmlutils.js');
var sanitizeHtml = require('sanitize-html');
let config = require('../config/config.js');
let Page = require('../common/page.js');

let router = express.Router();

let DEFAULT_PAGE_SIZE = 10;

const rejectedWords = config.comment && config.comment.rejected ? config.comment.rejected : [];

function cleanup(user, comment) {

    if (!user || user.role != 'admin') {

        let cs;
        if (!Array.isArray(comment)) {
            cs = [comment];
        } else {
            cs = comment;
        }

        cs.forEach(c => {
            delete c['authoremail'];
        });

        return cs;
    }

    return comment;
}

function isAcceptable(text) {
    let idx = rejectedWords.indexOf(commentBody.text);
    return idx === -1;
}

router.get('/', (req, res, next) => {

    let user = req.user;
    let mid = parseInt(req.query.messageid);
    let page = new Page(req, DEFAULT_PAGE_SIZE);
    let wheres = {};

    if (!mid && (!user || user.role != 'admin')) {
        return res.status(400).json({message: "Missing message's id"});
    }

    // By Message
    if (mid) wheres.messageid = mid;
    // Approved ?
    if (!user) wheres.approved = true;

    Models.comment.findAll({where: wheres, offset: page.offset(), limit: page.size(), order: 'createdat desc'}).then(comments => {
        res.json(cleanup(user, comments));
    }).catch(err => {
        next(err);
    })

});

router.post('/', (req, res, next) => {

    let user = req.user;
    let commentBody = req.body;

    let msgId = null;
    let authorId = null;
    let authorName = null;
    let authorEmail = null;

    // Fail early
    if (!commentBody.messageid) {
        next(new Error("Missing message's id"));
    }

    msgId = parseInt(commentBody.messageid);

    // Check offensive words
    // Bad, use another function.
    let acceptable = isAcceptable(commentBody.text);
    if (!acceptable) {
        return next(new ApiError(400, 'Usage of the word ' + rejected[idx] + ' is not allowed.'));
    }


    if (user) {
        authorId = user.id;
        authorName = user.displayname;
    } else if (commentBody.name && commentBody.email) {
        authorName = sanitizeHtml(commentBody.name, {allowedTags: []});
        authorEmail = sanitizeHtml(commentBody.email, {allowedTags: []})
    } else {
        return next(new Error("Missing name or email"));
    }

    let body = sanitizeHtml(commentBody.text, {allowedTags: [ 'br' ]});

    let comment = {
        body: body,
        authorname: authorName,
        authoremail: authorEmail,
        authorid: authorId,
        messageid: msgId,
        approved: user ? true : false
    };

    Models.comment.create(comment).then(newct => {
        res.status(201).json(cleanup(user, comment));
    }).catch(err => {
        next(err);
    });
});

router.put('/:commentId', authUtils.enforceLoggedIn, (req, res, next) => {
    let user = req.user;

    if (user.role != 'admin') {
        return res.status(401).json('unauthorized');
    }

    // We can either approve or delete a comment
    let op = req.body.operation;
    let cid = req.params.commentId;

    if (!op || !cid) {
        console.log(req, cid, op);
        return next(new Error("Missing operation or comment's Id"));
    }

    if (op == 'approve') {

        Models.comment.update({approved: true}, {where: {id: cid}});
        return res.json({id: cid, operation: 'approved'});

    } else if (op == 'delete') {
        Models.comment.destroy({
            where: {
                id: cid
            }
        });
        return res.json({id: cid, operation: 'deleted'});

    } else {
        res.status(400).json({message: 'Invalid operation'});
    }

});


module.exports = router;
