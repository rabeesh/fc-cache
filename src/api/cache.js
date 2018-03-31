const express = require('express');
const httpErrors = require('http-errors')

const toAsync = require('./../lib/toAsync');

module.exports = (config, logger, cacheManager) => {
    const app = express();

    /**
     * Get key from the store
     *
     * If key  not exits, then create a random key and returns it
     *
     */
    app.get('/:key', toAsync(async (req, res, next) => {
        const { key } = req.params;
        if (!key) {
            throw new httpErrors.BadRequest();
        }

        try {
            const cache = await cacheManager.getCacheByKey(key);
            logger.log('Cache hit');
            res.send(cache);
        } catch (err) {
            if (err.message != 'CacheNotExists') {
                throw err;
            }

            logger.log('Cache miss');
            const cache = await cacheManager.createCache();
            res.send({
                key: cache.toObject().key
            });
        }
    }));

    /**
     * Get all keys from the store
     *
     */
    app.get('/', toAsync(async (req, res, next) => {
        const all = await cacheManager.getAllCache();
        res.send(all);
    }));

    /**
     * Create data in the store
     *
     */
    app.post('/', toAsync(async (req, res, next) => {
        const { description } = req.body;
        if (!description) {
            throw new httpErrors.BadRequest();
        }

        const cache = cacheManager.createCache(description);
        res.send(cache);
    }));


    /**
     * Update data in the store
     *
     */
    app.put('/:key', toAsync(async (req, res, next) => {
        const { key } = req.params;
        const { description } = req.body;
        if (!key || !description) {
            throw new httpErrors.BadRequest();
        }

        let cache;
        try {
            cache = await getCacheByKey(key);
        } catch (err) {
            throw new httpErrors.NotFound();
        }

        cache.description = description;
        await cache.save();
        res.sendStatus(200);
    }));

    /**
     * Delete removes all keys from the cache
     *
     */
    app.delete('/', toAsync(async (req, res, next) => {
        await cacheManager.remove();
        res.sendStatus(204);
    }));

    /**
     * Removes a given key from the cache
     *
     */
    app.delete('/:key', toAsync(async (req, res, next) => {
        const { key } = req.params;
        if (!key) {
            throw new httpErrors.BadRequest();
        }

        try {
            await cacheManager.remove(key);
        } catch (err) {
            if (err.message == 'CacheNotExists') {
                throw new httpErrors.NotFound();
            }
            throw err;
        }

        res.sendStatus(204);
    }));

    return app;
}