// wrap into express handler into async/await
const mongoose = require('mongoose');
const uuidv4 = require('uuid/v4');

class CacheManager {

    constructor(dbConn) {
        this.dbConn = dbConn;
        this.schema = mongoose.Schema({
            description: 'string',
            key: 'string',
            created: ''
        });
    }

    /**
     * Get a cache by key
     *
     * @returns {Object} cache
     *
     */
    async getCacheByKey(key) {
        const Cache = this.dbConn.model('Cache', this.schema);
        const cache = await Cache.findOne({ 'key': key });
        if (!cache) {
            throw new Error('CacheNotExists');
        }
        return cache;
    }

    /**
     * Create a cache
     *
     * @returns {Object} cache
     */
    async createCache(description = '') {
        const CacheData = this.dbConn.model('Cache', this.schema);
        const cache = new CacheData({
            description: description,
            key: uuidv4()
        });
        await cache.save();
        return cache;
    }

    /**
     * Get all cache
     */
    async getAllCache() {
        const Cache = this.dbConn.model('Cache', this.schema);
        return await Cache.find({});
    }

    /**
     * Remove keys from cache
     *
     * @param {*} key if empty remove all
     */
    async remove(key = '') {
        if (key) {
            const cache = await this.getCacheByKey(key);
            await this.dbConn.model('Cache', this.schema)
                .remove({key: cache.key})
                .exec();
        } else {
            const Cache = this.dbConn.model('Cache', this.schema);
            await Cache.remove({});
        }
    }
}

module.exports = CacheManager;