const unexpected = require('unexpected');
const unexpectedExpress = require('unexpected-express');
const express = require('express');
const cacheHandlers = require('./../../src/api/cache')
const bodyParser = require('body-parser')

describe('api end points', () => {
    const expect = require('unexpected')
    .clone()
    .installPlugin(unexpectedExpress);

    expect.addAssertion('to yield a response of', (expect, subject, value) => {
        return expect(express()
            .use(bodyParser.json())
            .use(cacheHandlers()),
            'to yield exchange', {
                request: subject,
                response: value
            }
        );
    });

    describe('Cached data', () => {
        it('Should returns all stored keys in the cache', () => {
            return expect({
                url: '/cache'
            }, 'to yield a response of', {
                statusCode: 200,
                body: []
            });
        });

        it('Should create data with key', () => {
            return expect({
                url: 'POST /cache',
                body: {
                    data: 11,
                    description: 'balaa'
                }
            }, 'to yield a response of', {
                statusCode: 200,
                body: []
            });
        });
    });
});