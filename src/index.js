const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser')
const app = express();

const config = require('./../config');

(async () => {

    let dbConn;
    try {
        dbConn = await require('./lib/conMongo')(config);
    } catch (err) {
        console.error(`MongoDB connection error: ${err}`);
        process.exit(-1);
    }

    app.use(morgan('combined'));
    app.use(bodyParser.json())
    app.use((req, res, next) => {
        res.setHeader('Content-Type', 'application/json');
    })

    // use api handlers
    app.use(require('./api/cache')(config, dbConn));

    app.listen(3000, () => {
        console.log('App listening on port 3000')
    });
})();

module.exports = app;
