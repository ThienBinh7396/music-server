'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Playlists', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            title: {
                type: Sequelize.STRING
            },
            description: {
                type: Sequelize.TEXT,
                defaultValue: ''
            },
            thumbnail: {
                type: Sequelize.TEXT
            },
            ownerId: {
                type: Sequelize.INTEGER,
                defaultValue: -1
            },
            scope: {
                type: Sequelize.STRING
            },
            playlistCategory: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'PlaylistCategories',
                    key: 'id'
                }
            },
            views: {
                type: Sequelize.TEXT
            },
            likes: {
                type: Sequelize.TEXT,
                defaultValue: '[]'
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
        return queryInterface.dropTable('Playlists');
    }
};