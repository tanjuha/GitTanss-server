'use strict';
module.exports = (sequelize, DataTypes) => {
  const Project = sequelize.define('Project', {
    title: DataTypes.STRING,
    description: DataTypes.STRING
  }, {
    tableName: 'projects'
  });
  Project.associate = models => {
    Project.belongsToMany(models.User, {
      through: 'UsersProjects',
      as: 'users',
      foreignKey: 'projectId'
    })
  };
  return Project;
};