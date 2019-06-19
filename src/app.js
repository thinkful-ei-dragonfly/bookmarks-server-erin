'use strict';

require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const winston = require('winston');
const { bookmarks } = require('./store');
const bookmarksRouter = require('./bookmarks/bookmark-router');
const BookmarksService = require('./bookmarks/bookmarks-service');

const app = express();

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'info.log' })
  ]
});

if (NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption));
app.use(cors());
app.use(helmet());

app.get('/bookmarks', (req, res, next) => {
  const knexInstance = req.app.get('db');
  BookmarksService.getAllBookmarks(knexInstance)
    .then(bookmarks => {
      res.json(bookmarks);
    })
    .catch(next);
});

app.get('/bookmarks/:bookmarkId', (req, res, next) => {
  const knexInstance = req.app.get('db');
  BookmarksService.getById(knexInstance, req.params.bookmarkId)
    .then(bookmark => {
      res.json(bookmark);
    })
    .catch(next);
});

app.use(function validateBearerToken(req, res, next) {
  const apiToken = process.env.API_TOKEN;
  const authToken = req.get('Authorization');

  if(!authToken || authToken.split(' ')[1] !== apiToken) {
    logger.error(`Unathorized request to path: ${req.path}`);
    return res.status(401).json({ error: 'Unathorized request'});
  }

  next();
});

app.use(bookmarksRouter);

// app.get('/', (req, res) => {
//   res.send('Hello world');
// });

app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === 'production') {
    response = { error: { message: 'server error'} };
  } else {
    console.error(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});

module.exports = app;