const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser')

const config = require('./../config');
const Logger = require('./lib/Logger');
const CacheManager = require('./lib/CacheManager');

const logger = new Logger();
const app = express();

(async () => {
    let dbConn;
    try {
        dbConn = await require('./lib/conMongo')(config);
    } catch (err) {
        logger.error(`MongoDB connection error: ${err}`);
        process.exit(-1);
    }

    app.use(morgan('combined'));
    app.use(bodyParser.json())
    app.use((req, res, next) => {
        res.setHeader('Content-Type', 'application/json');
        next();
    });

    // use api handlers
    const cacheManager = new CacheManager(dbConn);
    app.use('/cache', require('./api/cache')(config, logger, cacheManager));

    app.listen(3000, () => {
        console.log('App listening on port 3000')
    });
})().catch(err => {
    console.log(err);
});

module.exports = app;
