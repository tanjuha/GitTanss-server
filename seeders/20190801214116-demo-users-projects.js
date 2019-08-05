'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    let userIds = [];
    let projectIds = [];
    let seq = queryInterface.sequelize;
    await seq.query('select id from users').then(result => {
      result[0].forEach(element => {
        userIds.push(element.id);
      });
    });
    await seq.query('select id from projects').then(result => {
      result[0].forEach(element => {
        projectIds.push(element.id);
      });
    });
    return queryInterface.bulkInsert('users_projects', [
      {
        userId: userIds[0],
        projectId: projectIds[0],
        roleName: 'owner'
      },
      {
        userId: userIds[1],
        projectId: projectIds[1],
        roleName: 'owner'
      },
      {
        userId: userIds[2],
        projectId: projectIds[2],
        roleName: 'owner'
      },
      {
        userId: userIds[3],
        projectId: projectIds[3],
        roleName: 'owner'
      }
    ], {})
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users_projects', null, {});
  }
};
