'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Musics', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            title: {
                type: Sequelize.STRING
            },
            thumbnail: {
                type: Sequelize.TEXT
            },
            lyric: {
                type: Sequelize.TEXT
            },
            lyricContributed: {
                type: Sequelize.STRING,
                defaultValue: 'admin'
            },
            href: {
                type: Sequelize.TEXT
            },
            duration: {
                type: Sequelize.STRING
            },
            size: {
                type: Sequelize.INTEGER
            },
            active: {
                type: Sequelize.INTEGER,
                defaultValue: 0
            },
            scope: {
                type: Sequelize.STRING,
                defaultValue: 'public'
            },
            views: {
                type: Sequelize.TEXT,
                defaultValue: '[]'
            },
            listeners: {
                type: Sequelize.TEXT,
                defaultValue: '[]'
            },
            likes: {
                type: Sequelize.TEXT,
                defaultValue: '[]'
            },
            uploadId: {
                type: Sequelize.INTEGER,
                defaultValue: -1
            },
            download: {
                type: Sequelize.INTEGER,
                defaultValue: 0
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('Musics');
    }
};