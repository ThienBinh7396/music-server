'use strict';
module.exports = (sequelize, DataTypes) => {
    const Singers = sequelize.define('Singers', {
        name: DataTypes.STRING,
        thumbnail: DataTypes.TEXT,
        information: DataTypes.TEXT,
        bannerHref: DataTypes.TEXT,
        followers: DataTypes.TEXT
    }, {});
    Singers.associate = function(models) {
        Singers.belongsToMany(models.Musics, {
            through: 'MapSingerMusics',
            as: 'singers',
            ortherKey: 'musicId',
            foreignKey: 'singerId'
        })
    };
    return Singers;
};