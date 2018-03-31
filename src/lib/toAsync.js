// wrap into express handler into async/await
const httpErrors = require('http-errors')

module.exports = (handler) => {
    return (req, res, next) => {
        handler(req, res, next)
        .catch(err => {
            console.error(err);
            if (err instanceof httpErrors.HttpError) {
                next(err);
            } else {
                next(new httpErrors.InternalServerError());
            }
        });
    };
};