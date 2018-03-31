// wrap into express handler into async/await
const mongoose = require('mongoose');
const uuidv4 = require('uuid/v4');

class CacheManager {

    constructor(dbConn) {
        this.dbConn = dbConn;
        this.schema = mongoose.Schema({
            data: 'object',
            key: 'string',
        }, {
            timestamps: {
                createdAt: 'created_at'
            }
        });
    }

    model() {
        return this.dbConn.model('Cache', this.schema);
    }


    /**
     * Get a cache by key
     *
     * @returns {Object} cache
     *
     */
    async getCacheByKey(key) {
        const cache = await this.model().findOne({ 'key': key });
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
    async createCache(data = {}) {
        const CacheData = this.model();
        const cache = new CacheData({
            data: data,
            key: uuidv4()
        });
        await cache.save();
        return cache;
    }

    /**
     * Get all cache
     */
    async getAllCache() {
        return await this.model().find({});
    }

    /**
     * Remove keys from cache
     *
     * @param {*} key if empty remove all
     */
    async remove(key = '') {
        if (key) {
            const cache = await this.getCacheByKey(key);
            await this.model()
                .remove({key: cache.key})
                .exec();
        } else {
            await this.model().remove({});
        }
    }

    /**
     * Get total count of cache enteries
     *
     * @returns {number} count
     */
    async countOfCache() {
        return await this.model().count({});
    }

    /**
     * Clean up expired cache entries based on TTL
     *
     */
    async cleanTTL(ttl) {
        const expireTime = Date.now() -  ttl * 1000 * 60 * 2;

        // (Date.now() - created_time) > ttl
        const expiredCaches = await this.model().find({
            created_at: {
                $lte: expireTime
            }
        });

        const count = expiredCaches.length;
        // Update each expired cache entry with new key
        await Promise.all(expiredCaches.map(cache => {
            return (async () => {
                const data = {
                    data: cache.data
                };
                await this.model().remove({ key: cache.key });
                await this.createCache(data);
            }) ();
        }));

        return count;
    }

    /**
     * Clean date by about to expire and data is null
     * And passed over 2/3 of time
     *
     * @requires { count }, if -1 it's in limit
     */
    async cleanMaximumLimit({ expirationTime, cacheMaximumLimit }) {
        const totalCacheCount = await cacheManager.countOfCache();
        if (totalCacheCount < cacheMaximumLimit) {
            return false;
        }

        const expireTime = Date.now() -  Math.ceil(expirationTime / .66) * 1000 * 60 * 2;
        const likelyDeletableCache = await this.model()
            // (Date.now() - created_time) > 2/3 of ttl
            .where('created_at').gt(expireTime)
            .where('data').equals(null)
            .limit(30)
            .sort('-createdAt')
            .exec();

        return likelyDeletableCache.map(c => c.key);
    }
}

module.exports = CacheManager;