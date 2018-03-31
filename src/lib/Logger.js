// Logger common handler
// It can be integrated with any logger library
class Logger {
    /*eslint no-console: off */
    log(...args) {
        console.log(...args);
    }

    /*eslint no-console: off */
    error(...args) {
        console.error(...args);
    }
}

module.exports = Logger;
