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

module.exports = {
    sanitizeUrl: sanitizeUrl,
    mkToHtml: mkToHtml
}