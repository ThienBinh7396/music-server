'use strict';
module.exports = (sequelize, DataTypes) => {
  const Downloads = sequelize.define('Downloads', {
    amount: DataTypes.INTEGER
  }, {});
  Downloads.associate = function(models) {
    // associations can be defined here
  };
  return Downloads;
};