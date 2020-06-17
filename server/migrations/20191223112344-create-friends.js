'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Friends', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            requestId: {
                type: Sequelize.INTEGER
            },
            responseId: {
                type: Sequelize.INTEGER
            },
            status: {
                type: Sequelize.STRING,
                defaultValue: 'pending'
            },
            lastMessage: {
                type: Sequelize.STRING,
                defaultValue: ''
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
        return queryInterface.dropTable('Friends');
    }
};