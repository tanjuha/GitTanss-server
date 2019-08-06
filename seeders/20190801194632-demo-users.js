'use strict';
const bcrypt = require('bcrypt');
const salt = 10;

module.exports = {
  up: (queryInterface, Sequelize) => {
    const hash = bcrypt.hashSync('password', salt);
    return queryInterface.bulkInsert('users', [
      {
        username: 'tom',
        email: 'tom@gmail.com',
        password: hash
      },
      {
        username: 'sem',
        email: 'sem@gmail.com',
        password: hash
      },
      {
        username: 'tanjuha',
        email: 'tanjuha@gmail.com',
        password: hash
      },
      {
        username: 'bob',
        email: 'bob@gmail.com',
        password: hash
    }
    ], {})
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', null, {});
  }
};