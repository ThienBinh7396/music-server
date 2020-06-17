'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Singers', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            name: {
                type: Sequelize.STRING
            },
            thumbnail: {
                type: Sequelize.TEXT
            },
            information: {
                type: Sequelize.TEXT
            },
            bannerHref: {
                type: Sequelize.TEXT
            },
            followers: {
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
        return queryInterface.dropTable('Singers');
    }
};