'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {

        return queryInterface.bulkInsert('Users', [{
                password: '72c41692163d6d502dc65a53a82719df55157bbb',
                name: 'thienbinh',
                email: 'demo@demo.com',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                password: '72c41692163d6d502dc65a53a82719df55157bbb',
                name: 'thienbinh',
                email: 'demo@demo1.com',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ], {});
    },

    down: (queryInterface, Sequelize) => {
        /*
          Add reverting commands here.
          Return a promise to correctly handle asynchronicity.

          Example:
          return queryInterface.bulkDelete('People', null, {});
        */
        return queryInterface.bulkDelete('Users', null, {});
    }
};