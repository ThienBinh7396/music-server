'use strict';
module.exports = (sequelize, DataTypes) => {
    const Users = sequelize.define('Users', {
        email: DataTypes.STRING,
        password: DataTypes.STRING,
        type: DataTypes.STRING,
        name: DataTypes.STRING,
        description: DataTypes.TEXT,
        thumbnail: DataTypes.TEXT,
        latestOnline: DataTypes.STRING,
        color: DataTypes.STRING
    }, {});
    Users.associate = function(models) {
        Users.hasMany(models.MusicComment, {
            foreignKey: 'userID'
        })

        Users.hasMany(models.PublicChats, {
            foreignKey: 'from'
        })


    };
    return Users;
};