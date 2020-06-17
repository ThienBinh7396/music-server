'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('MapPlaylistMusics', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            playlistId: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Playlists',
                    key: 'id'
                }
            },
            musicId: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Musics',
                    key: 'id'
                }
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
        return queryInterface.dropTable('MapPlaylistMusics');
    }
};