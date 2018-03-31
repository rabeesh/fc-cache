const express = require('express');
const httpErrors = require('http-errors')
const toAsync = require('./../lib/toAsync');

module.exports = (
    config,
    logger,
    cacheManager
) => {
    return express()
        .use(require('./expiryMiddleWare')(config, logger, cacheManager))
        .use(require('./cache')(logger, cacheManager));
};
