'use strict';

const { expect } = require('chai');
const knex = require('knex');
const app = require('../src/app');

describe.only('Bookmarks Endpoints', function() {
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

  
  context('Given there are books in the db', () => {
    const testBookmarks = [
      {
        id: 1,
        title: 'Something',
        url: 'https://courses.thinkful.com/ei-node-postgres-v1/checkpoint/9',
        desc: 'This is a description',
        rating: '4',
      },
      {
        id: 2,
        title: 'Something',
        url: 'https://courses.thinkful.com/ei-node-postgres-v1/checkpoint/9',
        desc: 'This is a description',
        rating: '4',
      },
      {
        id: 3,
        title: 'Something',
        url: 'https://courses.thinkful.com/ei-node-postgres-v1/checkpoint/9',
        desc: 'This is a description',
        rating: '4',
      }
    ];

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

    it('GET /bookmarks:bookmarkId responds with 200', () => {
      const bookmarkId = 2;
      const expectedBookmark = testBookmarks[bookmarkId - 1];
      return supertest(app)
        .get(`/bookmarks/${bookmarkId}`)
        .expect(200, expectedBookmark);
    });

  });
});