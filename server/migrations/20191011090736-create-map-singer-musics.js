'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('MapSingerMusics', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            singerId: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Singers',
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
        return queryInterface.dropTable('MapSingerMusics');
    }
};