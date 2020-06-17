'use strict';
module.exports = (sequelize, DataTypes) => {
    const MusicComment = sequelize.define('MusicComment', {
        musicId: DataTypes.INTEGER,
        userID: DataTypes.INTEGER,
        content: DataTypes.TEXT,
        time: DataTypes.STRING,
        parentId: DataTypes.INTEGER
    }, {});
    MusicComment.associate = function(models) {
        MusicComment.belongsTo(models.Users, {
            foreignKey: 'userID',
            targetKey: 'id'

        })

    };
    return MusicComment;
};