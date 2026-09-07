const fs = require('fs');
const express = require('express');
const morgan = require('morgan');
const app = express();
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

// middleware => modifies the incoming request data before it reaches the route handler
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
