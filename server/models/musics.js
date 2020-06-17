'use strict';
module.exports = (sequelize, DataTypes) => {
    const Musics = sequelize.define('Musics', {
        title: DataTypes.STRING,
        thumbnail: DataTypes.TEXT,
        lyric: DataTypes.TEXT,
        lyricContributed: DataTypes.STRING,
        href: DataTypes.TEXT,
        duration: DataTypes.STRING,
        size: DataTypes.INTEGER,
        active: DataTypes.INTEGER,
        scope: DataTypes.STRING,
        views: DataTypes.TEXT,
        listeners: DataTypes.TEXT,
        likes: DataTypes.TEXT,
        uploadId: DataTypes.INTEGER,
        download: DataTypes.INTEGER
    }, {});
    Musics.associate = function(models) {

        Musics.belongsToMany(models.Genres, {
            through: 'MapGenreMusics',
            as: 'genres',
            foreignKey: 'musicId',
            ortherKey: 'genreId'
        })

        Musics.belongsToMany(models.Singers, {
            through: 'MapSingerMusics',
            as: 'singers',
            foreignKey: 'musicId',
            ortherKey: 'singerId'
        })

        Musics.belongsToMany(models.Playlists, {
            through: 'MapPlaylistMusics',
            as: 'playlists',
            foreignKey: 'musicId',
            ortherKey: 'playlistId'
        })

    };
    return Musics;
};