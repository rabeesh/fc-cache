const express = require('express');
const httpErrors = require('http-errors');
const toAsync = require('./../lib/toAsync');

module.exports = (logger, cacheManager) => {
    const app = express();

    /**
     * Get key from the store
     *
     * If key  not exits, then create a random key and returns it
     *
     */
    app.get(
        '/:key',
        toAsync(async (req, res, next) => {
            const { key } = req.params;
            if (!key) {
                throw new httpErrors.BadRequest();
            }

            try {
                const cache = await cacheManager.getCacheByKey(key);
                logger.log('Cache hit');
                res.send(cache);
            } catch (err) {
                if (err.message !== 'CacheNotExists') {
                    throw err;
                }

                logger.log('Cache miss');
                const cache = await cacheManager.createCache();
                res.send({
                    key: cache.toObject().key,
                });
            }
        })
    );

    /**
     * Get all keys from the store
     *
     */
    app.get(
        '/',
        toAsync(async (req, res, next) => {
            const all = await cacheManager.getAllCache();
            res.send(all);
        })
    );

    /**
     * Create data in the store
     *
     */
    app.post(
        '/',
        toAsync(async (req, res, next) => {
            const data = req.body;
            if (!data) {
                throw new httpErrors.BadRequest();
            }

            const cache = await cacheManager.createCache(data);
            res.send(cache);
        })
    );

    /**
     * Update data in the store for the provided key
     *
     */
    app.put(
        '/:key',
        toAsync(async (req, res, next) => {
            const { key } = req.params;
            const data = req.body;
            if (!key || !data || Object.keys(data).length === 0) {
                throw new httpErrors.BadRequest();
            }

            let cache;
            try {
                cache = await cacheManager.getCacheByKey(key);
            } catch (err) {
                if (err.message == 'CacheNotExists') {
                    throw new httpErrors.NotFound();
                }
                throw err;
            }

            cache.data = data;
            await cache.save();
            res.sendStatus(200);
        })
    );

    /**
     * Delete removes all keys from the cache
     *
     */
    app.delete(
        '/',
        toAsync(async (req, res, next) => {
            await cacheManager.remove();
            res.sendStatus(204);
        })
    );

    /**
     * Removes a given key from the cache
     *
     */
    app.delete(
        '/:key',
        toAsync(async (req, res, next) => {
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
        })
    );

    return app;
};
