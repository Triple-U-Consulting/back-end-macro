const devError = (res, error) => {
    res.status(error.statusCode).json({
        status: error.statusCode,
        message: error.message,
        stackTrace: error.stack,
        error: error
    });
}

const prodError = (res, error) => {
    if(error.isOperational){
        res.status(error.statusCode).json({
            status: error.statusCode,
            message: error.message,
        });
    } else {
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong!!'
        })
    }
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