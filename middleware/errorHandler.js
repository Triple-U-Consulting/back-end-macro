const devError = (res, error) => {
    res.status(error.statusCode).json({
        status: error.statusCode,
        message: error.message,
        stackTrace: error.stack,
        error: error
    });
}

const prodError = (res, error) => {
    res.status(error.statusCode).json({
        status: error.statusCode,
        message: error.message,
    })
}

const errorHandler = (error, req, res, next) => {

    error.statusCode = error.statusCode || 500;
    error.status = error.status || 'error';

    if (process.env.TYPE_NODE_ERROR === 'development'){
        devError(res, error);
    } else if (process.env.TYPE_NODE_ERROR === 'production'){
        prodError(res, error);
    }
}

module.exports = {
    errorHandler
}