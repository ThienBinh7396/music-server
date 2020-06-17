'use strict';
module.exports = (sequelize, DataTypes) => {
  const Views = sequelize.define('Views', {
    list: DataTypes.TEXT
  }, {});
  Views.associate = function(models) {
    // associations can be defined here
  };
  return Views;
};