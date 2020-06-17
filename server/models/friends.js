'use strict';
module.exports = (sequelize, DataTypes) => {
    const Friends = sequelize.define('Friends', {
        requestId: DataTypes.INTEGER,
        responseId: DataTypes.INTEGER,
        status: DataTypes.STRING,
        lastMessage: DataTypes.STRING,
        time: DataTypes.STRING
    }, {
        indexes: [{
            unique: true,
            fields: ['requestId', 'responseId']
        }]

    });
    Friends.associate = function(models) {
        // associations can be defined here
    };
    return Friends;
};