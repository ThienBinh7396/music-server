'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Messages', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            fromId: {
                type: Sequelize.INTEGER
            },
            toId: {
                type: Sequelize.INTEGER
            },
            content: {
                type: Sequelize.TEXT
            },
            view: {
                type: Sequelize.INTEGER,
                defaultValue: 0
            },
            time: {
                type: Sequelize.STRING
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
        return queryInterface.dropTable('Messages');
    }
};