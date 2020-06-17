'use strict';
module.exports = (sequelize, DataTypes) => {
  const Messages = sequelize.define('Messages', {
    fromId: DataTypes.INTEGER,
    toId: DataTypes.INTEGER,
    content: DataTypes.TEXT,
    view: DataTypes.INTEGER,
    time: DataTypes.STRING
  }, {});
  Messages.associate = function(models) {
    // associations can be defined here
  };
  return Messages;
};