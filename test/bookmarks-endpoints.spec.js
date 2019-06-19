'use strict';

const { expect } = require('chai');
const knex = require('knex');
const app = require('../src/app');
const { makeBookmarksArray } = require('./bookmarks.fixtures');

describe('Bookmarks Endpoints', function() {
  let db;

  before('make knex instance', () => {
    db= knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    });
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());

  before('clean the table', () => db('bookmarks').truncate());

  afterEach('cleanup', () => db('bookmarks').truncate());

  describe('GET /bookmarks', () => {
    context('Given there are books in the db', () => {
      const testBookmarks = makeBookmarksArray();
      beforeEach('insert bookmark', () => {
        return db 
          .into('bookmarks')
          .insert(testBookmarks);
      });
  
      it('responds with 200 and all bookmarks', () => {
        return supertest(app)
          .get('/bookmarks')
          .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
          .expect(200, testBookmarks);
      //TO DO: more assertions
      });
    });

    context('Given no bookmarks', () => {
      it('responds with 200 and empty list', () => {
        return supertest(app)
          .get('/bookmarks')
          .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
          .expect(200, []);
      });
    });
  });

  describe('GET /bookmarks/:id', () => {
    context('When there are bookmarks', () => {
      const testBookmarks = makeBookmarksArray();
      beforeEach('insert bookmark', () => {
        return db 
          .into('bookmarks')
          .insert(testBookmarks);
      });

      it('GET /bookmarks:id responds with 200', () => {
        const bookmarkId = 2;
        const expectedBookmark = testBookmarks[bookmarkId - 1];
        return supertest(app)
          .get(`/bookmarks/${bookmarkId}`)
          .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
          .expect(200, expectedBookmark);
      });
    });
    
    context('When there are no bookmarks', () => {
      it('responds with 404', () => {
        return supertest(app)
          .get('/bookmarks/test')
          .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
          .expect(404, {
            error: { message: 'Bookmark not found' }
          });
      });
    });
  });
});