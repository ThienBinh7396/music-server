'use strict';
module.exports = (sequelize, DataTypes) => {
    const PlaylistCategories = sequelize.define('PlaylistCategories', {
        title: DataTypes.STRING,
        description: DataTypes.STRING,
        userPlaylist: DataTypes.INTEGER
    }, {});
    PlaylistCategories.associate = function(models) {
        PlaylistCategories.hasMany(models.Playlists, {
            foreignKey: {
                name: 'playlistCategory',
                allowNull: false
            }
        })

    };
    return PlaylistCategories;
};