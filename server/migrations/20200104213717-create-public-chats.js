'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('PublicChats', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            from: {
                type: Sequelize.INTEGER,
                references: {
                    model: "Users",
                    key: 'id'
                },
            },
            content: {
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
        return queryInterface.dropTable('PublicChats');
    }
};