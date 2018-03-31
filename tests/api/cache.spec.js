const unexpected = require('unexpected');
const unexpectedExpress = require('unexpected-express');
const express = require('express');
const bodyParser = require('body-parser');
const sinon = require('sinon');
const unexpectedSinon = require('unexpected-sinon');

const cacheHandlers = require('./../../src/api/cache')

describe('api end points', () => {
    const expect = require('unexpected')
    .clone()
    .use(unexpectedSinon)
    .installPlugin(unexpectedExpress);

    expect.addAssertion('to yield a response of', (expect, subject, value) => {
        return expect(express()
            .use(bodyParser.json())
            .use(cacheHandlers(config, logger, cacheManager)),
            'to yield exchange', {
                request: subject,
                response: value
            }
        );
    });

    const cacheManager= {};
    const config = {};
    const logger = {};
    const cacheData = {
        key: '123',
        data: {
            name: 'Abc'
        }
    };

    beforeEach(() => {
        cacheManager.getCacheByKey = sinon.stub().returns(Promise.resolve(cacheData));
        cacheManager.createCache = sinon.stub().returns(Promise.resolve(cacheData));
        cacheManager.getAllCache = sinon.stub().returns(Promise.resolve());
        cacheManager.remove = sinon.stub().returns(Promise.resolve());

        logger.log = sinon.stub();
    })


    describe('Cached data', () => {

        describe('GET data from store', () => {
            it('Should get key of current', () => {
                return expect({
                    url: 'GET /123'
                }, 'to yield a response of', {
                    statusCode: 200,
                    body: {
                        key: "123"
                    }
                })
                .then(() => {
                    expect(logger.log, 'was called once');
                    expect(cacheManager.getCacheByKey, 'was called once');
                    expect(cacheManager.createCache, 'was not called');
                    expect(logger.log, 'was called with', 'Cache hit');
                })
            });

            it('Should create a random key, when date not exists', () => {
                cacheManager.getCacheByKey.returns(Promise.reject(new Error('CacheNotExists')));
                cacheManager.createCache.returns(Promise.resolve({
                    toObject: sinon.stub().returns({
                        key: '123'
                    })
                }))

                return expect({
                    url: 'GET /123'
                }, 'to yield a response of', {
                    statusCode: 200,
                    body: {
                        key: "123"
                    }
                })
                .then(() => {
                    expect(logger.log, 'was called once');
                    expect(logger.log, 'was called with', 'Cache miss');
                    expect(cacheManager.getCacheByKey, 'was called once');
                    expect(cacheManager.createCache, 'was called once');
                })
            });

            it('Should returns all stored keys in the cache', () => {
                return expect({
                    url: '/'
                }, 'to yield a response of', {
                    statusCode: 200,
                    body: []
                });
            });
        })

        it('Should create data with key', () => {
            return expect({
                url: 'POST /',
                body: {
                    data: {
                        name: 'bac'
                    }
                }
            }, 'to yield a response of', {
                statusCode: 200,
                body: cacheData
            });
        });

        describe('PUT update for a key', () => {
            it('Should throw error if data or key not exists', () => {
                return expect({
                    url: 'PUT /abc'
                }, 'to yield a response of', 400);
            });

            it('Should update data with valid key', () => {
                const data = {
                    save: sinon.stub()
                };
                cacheManager.getCacheByKey.returns(data);
                return expect({
                    url: 'PUT /abc',
                    body: cacheData
                }, 'to yield a response of', 200)
                .then(() => {
                    expect(data.save, 'was called once');
                });
            });
        });

        describe('DELETE delete cache entries', () => {
            it('Should delete all entries', () => {
                return expect({
                    url: 'DELETE /'
                }, 'to yield a response of', 204)
                .then(() => {
                    expect(cacheManager.remove, 'was called once');
                    expect(cacheManager.remove, 'was called with', undefined);
                })
            });

            it('Should delete single entry', () => {
                return expect({
                    url: 'DELETE /abc'
                }, 'to yield a response of', 204)
                .then(() => {
                    expect(cacheManager.remove, 'was called with', 'abc');
                })
            });
        });

    });
});