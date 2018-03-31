const httpErrors = require('http-errors');

// wrap into express handler into async/await
module.exports = handler => {
    return (req, res, next) => {
        handler(req, res, next).catch(err => {
            if (err instanceof httpErrors.HttpError) {
                next(err);
            } else {
                next(new httpErrors.InternalServerError(err));
            }
        });
    };
};
