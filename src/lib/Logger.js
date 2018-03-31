
// Logger can be integrated with any logger
class Logger {
    log(...args) {
        console.log(...args);
    }

    error(...args) {
        console.error(...args);
    }
}

module.exports = Logger;