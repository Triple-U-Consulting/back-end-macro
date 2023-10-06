// import package
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const app = express();
const kambuhRouter = require('./api/router/kambuhRouter');
require('dotenv').config();

//middlewate
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//router
app.use('/kambuh', kambuhRouter);

// error handling
// declare error
app.use((req, res, next) => {
    const error = new Error
    error.status = 404

    // pass error as a parameter
    next(error)
});

app.use((error, req, res, next) => {
    res.status(error.status || 500).json({
        error: {
            message: error.message
        }
    })
    console.log(error)
})

module.exports = app;