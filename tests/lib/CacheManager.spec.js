const unexpected = require('unexpected');
const unexpectedExpress = require('unexpected-express');
const express = require('express');
const bodyParser = require('body-parser');
const sinon = require('sinon');
const unexpectedSinon = require('unexpected-sinon');

const config = require('./../../config');
const connMongo = require('./../../src/lib/connMongo');
const CacheManager = require('./../../src/lib/CacheManager');

describe('CacheManager', () => {
    const expect = require('unexpected')
    .clone()
    .use(unexpectedSinon);

    let cacheManager;
    let dbConn;
    let cache;

    // Create a database connection
    before(async() => {
        dbConn = await connMongo({
            mongoUri: config.mongoTestUri
        });
        cacheManager = new CacheManager(dbConn);
    });

    //After all tests are finished drop database and close connection
    after((done) => {
        dbConn.db.dropDatabase(function(){
            dbConn.close(done);
        });
    });

    beforeEach(async () => {
        cache = await cacheManager.createCache({
            someData: 'data'
        });
        await cacheManager.createCache({
            someData: 'another 2'
        });
    });

    afterEach(async () => {
        await cacheManager.remove();
    });

    describe('fetch data or count', () => {
        it('should get model by key', async () => {
            const data = await cacheManager.getCacheByKey(cache.key);
            expect(data.key, 'to be', cache.key);
        });

        it('should create a cache entry', () => {
            expect(cache.key, 'to be truthy');
        });

        it('should get all cache entries', async () => {
            const datas = await cacheManager.getAllCache();
            expect(datas.length, 'to be', 2);
        });

        it('should get total count of caches', async () => {
            const count = await cacheManager.countOfCache();
            expect(count, 'to be', 2);
        });
    });

    describe('remove cache', () => {
        it('should remove a cache', async () => {
            await cacheManager.remove(cache.key);
            const count = await cacheManager.countOfCache();
            expect(count, 'to be', 1);
        });

        it('should remove a all cache', async () => {
            await cacheManager.remove();
            const count = await cacheManager.countOfCache();
            expect(count, 'to be', 0);
        });
    });

    describe('clean TTL and maximum limit reached', () => {

        it('should clean TTL', async () => {
            const model = await cacheManager.model().findOne({ key: cache.key });
            // set date 5 mins before
            model.created_at = Date.now() -  5 * 1000 * 60;
            await model.save();
            const count = await cacheManager.cleanTTL(1);
            expect(count, 'to be', 1);
        });

        it('should return false, when total count in avilable limit', async () => {
            const likely = await cacheManager.cleanMaximumLimit({
                expirationTime: 1,
                cacheMaximumLimit: 2
            });
            expect(likely, 'to be', false);
        });

        it('should show invalid enteries, when total cache reaches avilable limit', async () => {
            await cacheManager.createCache({
                someData: 'another 3'
            });
            const model = await cacheManager.model().findOne({ key: cache.key });
            // set date 20 mins before
            model.created_at = Date.now() -  20 * 1000 * 60;
            model.data = null;
            await model.save();

            const likely = await cacheManager.cleanMaximumLimit({
                expirationTime: 5,
                cacheMaximumLimit: 2
            });
            expect(likely.length, 'to be', 1);
        });
    });
});
