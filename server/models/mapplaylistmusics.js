'use strict';
module.exports = (sequelize, DataTypes) => {
    const MapPlaylistMusics = sequelize.define('MapPlaylistMusics', {
        playlistId: DataTypes.INTEGER,
        musicId: DataTypes.INTEGER
    }, {});
    MapPlaylistMusics.associate = function(models) {

    };
    return MapPlaylistMusics;
};