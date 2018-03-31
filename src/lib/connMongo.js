const mongoose = require('mongoose');

/**
 * Connect to mongo db
 *
 * @returns {object} Mongoose connection
 * @public
 */

module.exports = async config => {
    return await new Promise((resolve, reject) => {
        // Exit application on error
        mongoose.connection.on('error', reject);

        mongoose.connection.once('open', () => {
            resolve(mongoose.connection);
        });

        // logs in dev env
        if (config.env === 'development') {
            mongoose.set('debug', true);
        }

        mongoose.connect(config.mongoUri, {
            keepAlive: 1,
        });
    });
};
