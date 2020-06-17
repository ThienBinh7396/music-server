'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('Employees', [{
                password: '72c41692163d6d502dc65a53a82719df55157bbb',
                name: 'thienbinh',
                email: 'demo@demo.com',
                phone: '031212312312',
                address: 'HP',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                password: '72c41692163d6d502dc65a53a82719df55157bbb',
                name: 'thienbinh',
                email: 'demo@demo1.com',
                phone: '031212312312',
                address: 'HP',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ], {});
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Employees', null, {});
    }
};