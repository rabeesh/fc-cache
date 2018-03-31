const express = require('express');

module.exports = () => {
    const app = express();

    /**
     * Get all keys from the store
     *
     */
    app.get('/cache', (req, res, next) => {
        res.send([]);
    });

    /**
     * Create data in the store
     *
     */
    app.post('/cache', (req, res, next) => {
        res.send(req.body);
    });


    /**
     * Update data in the store
     *
     */
    app.put('/cache', (req, res, next) => {
        res.send([]);
    });

    /**
     * Delete removes all keys from the cache
     *
     */
    app.delete('/cache', (req, res, next) => {
        res.send([]);
    });

    /**
     * Removes a given key from the cache
     *
     */
    app.delete('/cache', (req, res, next) => {
        res.send([]);
    });


    return app;
}