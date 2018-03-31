const path = require('path');
const dotenv = require('dotenv');

/**
 * Load config variables from .env file
 */
dotenv.config({path: path.join(__dirname , '.env')});

module.exports = {
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3000,
    maximumCacheLimit: process.env.MAXIMUM_CACHE_LIMIT || 10,
    // in minutes
    expirationTime: process.env.EXPIRATION_TIME || 15,
    mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/fc-cache',
    mongoTestUri: process.env.MONGO_TEST_URI || 'mongodb://localhost:27017/test-fc-cache'

}