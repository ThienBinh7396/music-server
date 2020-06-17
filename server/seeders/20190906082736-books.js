'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        /*
          Add altering commands here.
          Return a promise to correctly handle asynchronicity.

          Example:
          return queryInterface.bulkInsert('People', [{
            name: 'John Doe',
            isBetaMember: false
          }], {});
          */
        return queryInterface.bulkInsert('Books', [{
                title: 'John Doe',
                userId: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                title: 'John Doe1',
                userId: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                title: 'John Doe3',
                userId: 2,
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
        return queryInterface.bulkDelete('Books', null, {});
    }
};