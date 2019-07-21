'use strict';

const express = require('express');
const logger = require('../logger');
const { isWebUri } = require('valid-url');
const xss = require('xss');
const BookmarksService = require('./bookmarks-service');

const bookmarksRouter = express.Router();
const bodyParser = express.json();

const serializeBookmark = bookmark => ({
  id: bookmark.id,
  title: xss(bookmark.title),
  url: bookmark.url,
  description: xss(bookmark.description),
  rating: Number(bookmark.rating),
});

bookmarksRouter
  .route('/bookmarks')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db');
    BookmarksService.getAllBookmarks(knexInstance)
      .then(bookmarks => {
        res.json(bookmarks.map(serializeBookmark));
      })
      .catch(next);
  })
  .post(bodyParser, (req,res, next) => {
    const { title, url, description ,rating } = req.body;

    if(!title) {
      logger.error('Title is required');
      return res
        .status(400)
        .send('Title is required');
    }
    if(!url || !isWebUri(url)) {
      logger.error('Valid URL is required');
      return res
        .status(400)
        .send('Valid URL is required');
    }

    if (!Number.isInteger(rating) || rating < 0 || rating > 5) {
      logger.error(`Invalid rating '${rating}' supplied`)
      return res.status(400).send({
        error: { message: `'rating' must be a whole number between 0 and 5` }
      });
    }

    const newBookmark = { title, url, description, rating };
    BookmarksService.insertBookmark(req.app.get('db'), newBookmark)
      .then(bookmark => {
        res 
          .status(201)
          .location(`/bookmarks/${newBookmark.id}`)
          .json(serializeBookmark(bookmark));
      })
      .catch(next);
    // const bookmark = {
    //   id,
    //   title,
    //   url,
    //   desc,
    //   rating
    // };

    // bookmarks.push(bookmark);

    // res
    //   .status(201)
    //   .location(`http://localhost:8000/bookmarks/${id}`)
    //   .json(bookmark);

  });

bookmarksRouter
  .route('/bookmarks/:bookmark_id')
  .get((req, res, next) => {
    const { bookmark_id } = req.params;
    const knexInstance = req.app.get('db');
    // const bookmark = bookmarks.find(b => b.id == id );
    BookmarksService.getById(knexInstance, bookmark_id)
      .then(bookmark => {
        if(!bookmark) {
          logger.error(`Bookmark with id ${bookmark_id} not found`);
          return res
            .status(404)
            .json({
              // eslint-disable-next-line quotes
              error: { message: `Bookmark Not Found` }
            });
        }
        res.json(serializeBookmark(bookmark));
      })
      .catch(next);
  })
  .delete((req, res, next) => {
    const { bookmark_id } = req.params;
    const knexInstance = req.app.get('db');

    BookmarksService.getById(knexInstance, bookmark_id)
      .then(bookmark => {
        if(!bookmark) {
          logger.error(`Bookmark with id ${bookmark_id} not found`);
          return res
            .status(404)
            .json({
              // eslint-disable-next-line quotes
              error: { message: `Bookmark Not Found` }
            });
        } 
      });

    BookmarksService.deleteBookmark(knexInstance, bookmark_id)
      .then(rowsAffected => {
        logger.info(`Bookmark with id ${bookmark_id} deleted`);
        res.status(204).end();
      })
      .catch(next);
  });


module.exports = bookmarksRouter;