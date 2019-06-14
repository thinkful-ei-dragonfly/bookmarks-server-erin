'use strict';

const express = require('express');
const uuid = require('uuid/v4');
const logger = require('../logger');
const { bookmarks } = require('../store');
const { isWebUri } = require('valid-url');

const bookmarksRouter = express.Router();
const bodyParser = express.json();

bookmarksRouter
  .route('/bookmarks')
  .get((req, res) => {
    res.send({bookmarks});
  })
  .post(bodyParser, (req,res) => {
    const { title, url, desc, rating } = req.body;

    if(!title) {
      logger.error('Title is required');
      return res
        .status(400)
        .send('Invalid data');
    }

    if(!url || !isWebUri(url)) {
      logger.error('Valid URL is required');
      return res
        .status(400)
        .send('Invalid data');
    }

    if(rating && typeof rating !== 'number') {
      logger.error('Rating must be a number');
      return res
        .status(400)
        .send('Invalid data');
    }

    if((rating && rating <0) || (rating && rating >5)) {
      logger.error('Rating must be a number between 0 and 5');
      return res
        .status(400)
        .send('Invalid data');
    }

    const id = uuid();

    const bookmark = {
      id,
      title,
      url,
      desc,
      rating
    };

    bookmarks.push(bookmark);

    res
      .status(201)
      .location(`http://localhost:8000/card/${id}`)
      .json(bookmark);

  });

bookmarksRouter
  .route('/bookmarks/:id')
  .get((req, res) => {
    const { id } = req.params;
    const bookmark = bookmarks.find(b => b.id == id );

    if(!bookmark) {
      logger.error(`Bookmark with id ${id} not found`);
      return res
        .status(404)
        .send('Bookmark not found');
    }

    res.json(bookmark);
  })
  .delete((req, res) => {
    const { id } = req.params;

    const bookmarkIndex = bookmarks.findIndex(b => b.id == id );

    if (bookmarkIndex === -1) {
      logger.error(`Bookmark with id ${id} not found`);
      return res
        .status(404)
        .send('Bookmark not found');
    }

    bookmarks.splice(bookmarkIndex, 1);

    logger.info(`Bookmark with id ${id} deleted`);

    res
      .status(204)
      .end();
  });


module.exports = bookmarksRouter;