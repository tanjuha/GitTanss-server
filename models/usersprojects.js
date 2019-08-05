'use strict';
module.exports = (sequelize, DataTypes) => {
  const UsersProjects = sequelize.define('UsersProjects', {
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    projectId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Project',
            key: 'id'
        }
    },
    roleName: DataTypes.STRING
  }, {
    tableName: 'users_projects'
  });
  return UsersProjects;
};