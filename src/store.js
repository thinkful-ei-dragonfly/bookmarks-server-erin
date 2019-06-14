'use strict';

const uuid = require('uuid/v4');

const bookmarks = [
  {
    id: uuid(),
    title: 'Something',
    url: 'https://courses.thinkful.com/ei-node-postgres-v1/checkpoint/9',
    desc: 'This is a description',
    rating: 4,
  }
];

module.exports = {bookmarks};