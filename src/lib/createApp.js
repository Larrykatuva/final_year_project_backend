const express = require('express');
const bp = require('body-parser');
const AuthRoutes = require('../routes/authRoutes');
const createError = require('http-errors');
const cors = require('cors')

/**
 * 
 * @returns instance of the  application
 */
const createApp = async () => {
    const app = express();
    app.use(bp.json());
    app.use(cors())

    /**
     * Cors policy configurations 
     */
    var corsOptions = {
        origin: ['http://localhost:3000','*'],
        optionsSuccessStatus: 200 
    }

    /**
     * Routes goes here.
     */
    app.use('/auth', cors(corsOptions), AuthRoutes);



    //Function to catch all unfound URL endpoints
    app.use((req, res, next) => {
        next(createError(404, 'Not found'));
    });

    app.use((err, req, res, next) => {
        console.log(err)
        res.status(err.status || 5000)
        res.send({
            data: {
                status: err.status || 5000,
                message: err.message
            }
        })
    })

    return app;
}

module.exports = createApp;
