const unexpected = require('unexpected');
const unexpectedExpress = require('unexpected-express');
const express = require('express');
const bodyParser = require('body-parser');
const sinon = require('sinon');
const unexpectedSinon = require('unexpected-sinon');

const CacheManager = require('./../../src/lib/CacheManager')

describe('CacheManager', () => {
    const expect = require('unexpected')
    .clone()
    .use(unexpectedSinon);

    let cacheManager;
    let dbConn;

    beforeEach(() => {
        dbConn = {
            model: sinon.stub()
        };
        cacheManager = CacheManager(dbConn);
    });

    it('should get model by key', () => {

    });

    it('should create a cache entry', () => {

    });

    it('should get all cache entries', () => {

    });

    it('should get total count of caches', () => {

    });

    it('should clean TTL', () => {

    });

    it('should show likely to deletable item, when total cache reaches avilable limit', () => {

    });
});
