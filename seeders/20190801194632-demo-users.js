'use strict';
const bcrypt = require('bcrypt');
const salt = 10;

module.exports = {
  up: (queryInterface, Sequelize) => {
    const hash = bcrypt.hashSync('password', salt)
    return queryInterface.bulkInsert('users', [
      {
        username: 'tom',
        email: 'tom@email.com',
        password: hash
      },
      {
        username: 'sem',
        email: 'sem@email.com',
        password: hash
      },
      {
        username: 'tanjuha',
        email: 'tanjuha@email.com',
        password: hash
      },
      {
        username: 'bob',
        email: 'bob@email.com',
        password: hash
    }
    ], {})
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', null, {});
  }
};