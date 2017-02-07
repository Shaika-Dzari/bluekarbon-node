let config = require('../config/config');
let Remarkable = require('remarkable');

const remarkable = new Remarkable();

const sanitizeUrl = (str) => {
    let oneStr = str || '';

    oneStr = oneStr.replace(/[!$?*&#\\]/, '');
    oneStr = oneStr.replace(/[^a-z0-9_\-]/gi, '_');

    return oneStr.toLowerCase();
}

const mkToHtml = (text) => {
    if (text) {
       return remarkable.render(text)
    }
    return null;
}


function computePrettyUrl(msgs) {
    if (msgs) {
        let newmsgs;
        if (Array.isArray(msgs)) {
            newmsgs = [];
            for (let m of msgs) {
                let am = m.dataValues;
                am.permurl = am.id + '--' + am.prettyurl;
                newmsgs.push(am);
            }
        } else {
            newmsgs = msgs.dataValues;
            newmsgs.permurl = msgs.id + '--' + msgs.prettyurl;
        }

        return newmsgs;
    }

    return msgs;
}


module.exports = {
    sanitizeUrl: sanitizeUrl,
    mkToHtml: mkToHtml,
    computePrettyUrl: computePrettyUrl
}