'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {

        return queryInterface.bulkInsert('PlaylistCategories', [{
            title: 'User Playlist',
            userPlaylist: 1,
            description: "",
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            title: 'Electronic/Dance',
            userPlaylist: 0,
            description: "Dance music, club music, or simply dance",
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            title: 'Have A Nice Dream',
            userPlaylist: 0,
            description: 'Nice dreams master',
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            title: 'Mood',
            userPlaylist: 0,
            description: 'No matter what mood you’re in, there’s music to match',
            createdAt: new Date(),
            updatedAt: new Date()
        }], {});
    },

    down: (queryInterface, Sequelize) => {
        /*
          Add reverting commands here.
          Return a promise to correctly handle asynchronicity.

          Example:
          return queryInterface.bulkDelete('People', null, {});
        */
    }
};