'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('MapGenreMusics', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            genreId: {
                type: Sequelize.INTEGER,
                references: {
                    model: "Genres",
                    key: 'id'
                },
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
        return queryInterface.dropTable('MapGenreMusics');
    }
};