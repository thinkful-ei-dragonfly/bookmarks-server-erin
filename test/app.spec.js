// 'use strict';
// /* global supertest*/

// const app = require('../src/app');
// const expect = require('chai').expect;
// const request = require('supertest');
// const { bookmarks } = require('../src/store');

// describe('GET /bookmarks', ()=> {
//   it('responds with 200 containing all bookmarks', () => {
//     return supertest(app)
//       .get('/bookmarks')
//       .set('AUthorization', `Bearer ${process.env.API_TOKEN}`)
//       .expect(200, {bookmarks});
//   });
// });

// describe('GET /bookmarks/:id', () => {
//   it('responds with 200 containing the bookmark', ()=> {
//     let bookmarkId = bookmarks[0];
//     return supertest(app)
//       .get(`/bookmarks/${bookmarkId.id}`)
//       .set('AUthorization', `Bearer ${process.env.API_TOKEN}`)
//       .expect(200, bookmarkId);
//   });

//   it('responds with a 404 not found', ()=> {
//     return supertest(app)
//       .get('/bookmarks/random-id')
//       .set('AUthorization', `Bearer ${process.env.API_TOKEN}`)
//       .expect(404,'Bookmark not found');
//   });
// });

// describe('POST /bookmarks', () => {
//   it('responds with 201 containing the bookmark', ()=> {
//     let sampleBook = {
//       title: 'Something',
//       url: 'https://courses.thinkful.com/ei-node-postgres-v1/checkpoint/9',
//       desc: 'This is a description',
//       rating: 1
//     };
//     return supertest(app)
//       .post('/bookmarks')
//       .send(sampleBook)
//       .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
//       .expect(201)
//       .expect(res => {
//         expect(res.body.title).to.eql(sampleBook.title);
//         expect(res.body.url).to.eql(sampleBook.url);
//         expect(res.body.desc).to.eql(sampleBook.desc);
//         expect(res.body.rating).to.eql(sampleBook.rating);
//         expect(res.body.id).to.be.a('string');
//       })
//       .then(res => {
//         expect(bookmarks[bookmarks.length - 1]).to.eql(res.body);
//       });
//   });

//   // it('responds with 200 containing the bookmark', ()=> {
//   //   return supertest(app)
//   //     .get('/bookmarks/random-id')
//   //     .set('AUthorization', `Bearer ${process.env.API_TOKEN}`)
//   //     .expect(404,'Bookmark not found');  ;p98;'poopopol  // });
// });
  


