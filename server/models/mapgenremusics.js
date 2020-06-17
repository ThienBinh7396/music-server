'use strict';
module.exports = (sequelize, DataTypes) => {
    const MapGenreMusics = sequelize.define('MapGenreMusics', {
        genreId: DataTypes.INTEGER,
        musicId: DataTypes.INTEGER
    }, {});
    MapGenreMusics.associate = function(models) {
        // associations can be defined here

    };
    return MapGenreMusics;
};