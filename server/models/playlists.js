'use strict';
module.exports = (sequelize, DataTypes) => {
    const Playlists = sequelize.define('Playlists', {
        title: DataTypes.STRING,
        description: DataTypes.TEXT,
        thumbnail: DataTypes.TEXT,
        ownerId: DataTypes.INTEGER,
        scope: DataTypes.STRING,
        playlistCategory: DataTypes.INTEGER,
        views: DataTypes.TEXT,
        likes: DataTypes.TEXT
    }, {});
    Playlists.associate = function(models) {
        Playlists.belongsTo(models.PlaylistCategories, {
            foreignKey: 'playlistCategory',
            targetKey: 'id'
        })

        Playlists.belongsToMany(models.Musics, {
            through: 'MapPlaylistMusics',
            as: 'musics',
            foreignKey: 'playlistId',
            ortherKey: 'musicId'
        })
    };
    return Playlists;
};