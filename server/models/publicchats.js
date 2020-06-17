'use strict';
module.exports = (sequelize, DataTypes) => {
    const PublicChats = sequelize.define('PublicChats', {
        from: DataTypes.INTEGER,
        content: DataTypes.TEXT,
        likes: DataTypes.TEXT
    }, {});
    PublicChats.associate = function(models) {
        // associations can be defined here

        PublicChats.belongsTo(models.Users, {
            foreignKey: 'from',
            targetKey: 'id'

        })
    };
    return PublicChats;
};