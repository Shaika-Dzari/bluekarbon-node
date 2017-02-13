const DEFAULT_PAGE = 0;
const DEFAULT_PAGE_SIZE = 15;
const DEFAULT_MAX_PAGE_SIZE = 30;

function Page(request, pagesize) {
    let size = request.query.size ? parseInt(request.query.size) : pagesize || DEFAULT_PAGE_SIZE;
    let page = request.query.page ? parseInt(request.query.page) - 1 : DEFAULT_PAGE;

    if (size > DEFAULT_MAX_PAGE_SIZE) {
        size = DEFAULT_MAX_PAGE_SIZE;
    }

    let offset = page * size;

    this._params = {
        offset: offset,
        page: page,
        size: size
    }
}

Page.prototype.params = function() {
    return this._params;
}


Page.prototype.page = function() {
    return this._params.page;
}


Page.prototype.offset = function() {
    return this._params.offset;
}


Page.prototype.size = function() {
    return this._params.size;
}

Page.prototype.merge = function(routeParams, override) {

    for(var k in this._params) {
        if (override || !routeParams[k])
            routeParams[k] = this._params[k];
    }

    return routeParams;
}

module.exports = Page;