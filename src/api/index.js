const express = require('express');

module.exports = (config, logger, cacheManager) => {
    return express()
        .use(require('./expiryMiddleWare')(config, logger, cacheManager))
        .use(require('./cache')(logger, cacheManager));
};
