const path = require('path');
const dotenv = require('dotenv');

/**
 * Load config variables from .env file
 */
dotenv.config({path: path.join(__dirname , '.env')});

module.exports = {
    env: process.env.NODE_ENV,
    expirationTime: process.env.EXPIRATION_TIME,
    mongoUri: process.env.MONGO_URI
}