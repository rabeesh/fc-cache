const express = require('express');
const httpErrors = require('http-errors');
const toAsync = require('./../lib/toAsync');

module.exports = (config, logger, cacheManager) => {
    const cleanByLimitHandler = toAsync(async (req, res, next) => {
        const toBeCleaned = await cacheManager.cleanMaximumLimit(config);
        if (toBeCleaned !== false) {
            logger.log(
                'Maximum caches is exceeds, you can clean:',
                toBeCleaned
            );
            throw httpErrors.Conflict();
        }
        next();
    });

    return (
        express()
            /**
             * Clean up cache entries, which expiry over than EXPIRATION_TIME
             *
             */
            .use(
                toAsync(async (req, res, next) => {
                    const count = await cacheManager.cleanTTL(
                        config.expirationTime
                    );
                    if (count > 0) {
                        logger.log('clean up expired cache by TTL');
                    }
                    next();
                })
            )

            /**
             * If cache count is more than MAXIMUM_CACHE_LIMIT
             * Then clean up data by
             *     cache.data  = null
             * And clean up expire time is over than 2/3 of time
             *
             * If cache count is more than limit
             * We won't allow create request to add new cache
             */
            .get('/cache/:id', cleanByLimitHandler)
            .post('/cache', cleanByLimitHandler)
    );
};
