const express = require('express');
const morgan = require('morgan');

const gameRouter = require('./routes/gameRoutes');
const userRouter = require('./routes/userRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

// 1️ GLOBAL MIDDLEWARES
// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body parser, reading data from body into req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request time middleware (like Tours app)
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 2️ ROUTES (no authentication for now, like Tours app)
app.use('/api/v1/games', gameRouter);
app.use('/api/v1/users', userRouter);

// 3️ 404 HANDLER
app.use((req, res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server`, 404));
});

// 4️ GLOBAL ERROR HANDLER
app.use(globalErrorHandler);

module.exports = app;