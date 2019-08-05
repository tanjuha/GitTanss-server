'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    tableName: 'users'
  });
  User.associate = models => {
    User.belongsToMany(models.Project, {
      through: 'UsersProjects',
      as: 'projects',
      foreignKey: 'userId'
    })
  }
  return User;
};