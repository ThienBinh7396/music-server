'use strict';
module.exports = (sequelize, DataTypes) => {
    const genres = sequelize.define('Genres', {
        title: DataTypes.STRING,
        href_params: DataTypes.STRING
    }, {});
    genres.associate = function(models) {
        genres.belongsToMany(models.Musics, {
            through: 'MapGenreMusics',
            as: 'musics',
            ortherKey: 'musicId',
            foreignKey: 'genreId'
        })
    };
    return genres;
};