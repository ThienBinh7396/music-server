'use strict';
module.exports = (sequelize, DataTypes) => {
  const Books = sequelize.define('Books', {
    title: DataTypes.STRING,
    userId: DataTypes.INTEGER
  }, {});
  Books.associate = function(models) {
    // associations can be defined here
  };
  return Books;
};