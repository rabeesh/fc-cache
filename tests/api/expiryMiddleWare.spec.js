const unexpected = require('unexpected');
const unexpectedExpress = require('unexpected-express');
const express = require('express');
const bodyParser = require('body-parser');
const sinon = require('sinon');
const unexpectedSinon = require('unexpected-sinon');

const expiryMiddleWare = require('./../../src/api/expiryMiddleWare')

describe('expiryMiddleWare', () => {
    const expect = require('unexpected')
    .clone()
    .use(unexpectedSinon)
    .installPlugin(unexpectedExpress);

    expect.addAssertion('to yield a response of', (expect, subject, value) => {
        return expect(express()
            .use(bodyParser.json())
            .use(expiryMiddleWare(config, logger, cacheManager))
            .use((req, res, next) => {
                res.sendStatus(200);
            }),
            'to yield exchange', {
                request: subject,
                response: value
            }
        );
    });

    const cacheManager= {};
    const logger = {};
    const config = {};
    const cacheData = {
        key: '123',
        data: {
            name: 'Abc'
        }
    };

    beforeEach(() => {
        cacheManager.cleanMaximumLimit = sinon.stub().returns(Promise.resolve());
        cacheManager.cleanTTL = sinon.stub().returns(Promise.resolve(1));

        logger.log = sinon.stub();
    })


    describe('Expiry by TTL', () => {
        it('Should clean up expired orders', () => {
            return expect({
                url: '/'
            }, 'to yield a response of', 200)
            .then(() => {
                expect(cacheManager.cleanTTL, 'was called once');
                expect(logger.log, 'was called once');
            });
        });
    });

    describe('Clean up by MAXIMUM_CACHE_LIMIT', () => {
        it('Should not clean up on other API requests', () => {
            return expect({
                url: 'DELETE /'
            }, 'to yield a response of', 200)
            .then(() => {
                expect(cacheManager.cleanMaximumLimit, 'was not called');
                expect(logger.log, 'was called once');
            });
        });

        it('Should clean up, when limit is reaches MAXIMUM_CACHE_LIMIT', () => {
            cacheManager.cleanMaximumLimit.returns(Promise.resolve(['a2', 'a1']))
            return expect({
                url: 'POST /cache'
            }, 'to yield a response of', 409)
            .then(() => {
                expect(cacheManager.cleanMaximumLimit, 'was called once');
                expect(logger.log, 'was called twice');
            });
        });

    });

});