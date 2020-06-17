'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Users', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            email: {
                type: Sequelize.STRING,
                unique: true
            },
            password: {
                type: Sequelize.STRING,
            },
            type: {
                type: Sequelize.STRING,
                defaultValue: 'email'
            },
            name: {
                type: Sequelize.STRING
            },
            thumbnail: {
                type: Sequelize.TEXT,
                defaultValue: 'https://res.cloudinary.com/do1xjyyru/image/upload/v1567830811/public/avatar_qarz4k.png'
            },
            description: {
                type: Sequelize.TEXT,
                defaultValue: ''
            },
            latestOnline: {
                type: Sequelize.STRING,
                defaultValues: ''
            },
            color: {
                type: Sequelize.STRING,
                defaultValue: '#B153FB'
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
        return queryInterface.dropTable('Users', {
            restartIdentity: true
        });
    }
};