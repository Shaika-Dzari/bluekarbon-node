function SimpleCache(pLoader) {
    this.items = {};
    this.loader = pLoader;
}

SimpleCache.prototype.get = function(pKey) {
    let item = this.items[pKey];
    if (!item) {
        let loadedItem = this.loader(pKey);
        this.items[pKey] = loadedItem;
        item = loadedItem;
    }

    return item;
}

SimpleCache.prototype.remove = function(pKey) {
    delete this.items[pKey];
}

module.exports = SimpleCache;
