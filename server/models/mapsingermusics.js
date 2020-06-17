'use strict';
module.exports = (sequelize, DataTypes) => {
  const MapSingerMusics = sequelize.define('MapSingerMusics', {
    singerId: DataTypes.INTEGER,
    musicId: DataTypes.INTEGER
  }, {});
  MapSingerMusics.associate = function(models) {
    // associations can be defined here
  };
  return MapSingerMusics;
};