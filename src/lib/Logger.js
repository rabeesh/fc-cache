// Logger common handler
// It can be integrated with any logger library
class Logger {
    log(...args) {
        console.log(...args);
    }

    error(...args) {
        console.error(...args);
    }
}

module.exports = Logger;