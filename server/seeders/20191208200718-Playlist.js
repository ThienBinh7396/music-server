'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        /*
          Add altering commands here.
          Return a promise to correctly handle asynchronicity.

          Example:
          */
        return queryInterface.bulkInsert('Playlists', [{
                title: 'John Doe',
                description: 'false',
                thumbnail: "https://res.cloudinary.com/do1xjyyru/image/upload/v1575738518/test/nfznqvykew83v4uabxl3.jpg",
                playlistCategory: 2,
                scope: 'public',
                "createdAt": "2019-11-02T18:35:41Z",
                "updatedAt": "2019-11-02T18:35:41Z"
            },
            {
                title: 'John Doe 12',
                description: 'false 12 2',
                thumbnail: "https://res.cloudinary.com/do1xjyyru/image/upload/v1575738518/test/nfznqvykew83v4uabxl3.jpg",
                playlistCategory: 3,
                scope: 'public',
                "createdAt": "2019-11-02T18:35:41Z",
                "updatedAt": "2019-11-02T18:35:41Z"
            },
            {
                title: 'zzz 12John Doe 12',
                description: 'aa false 12 2',
                thumbnail: "https://res.cloudinary.com/do1xjyyru/image/upload/v1575738518/test/nfznqvykew83v4uabxl3.jpg",
                playlistCategory: 3,
                scope: 'public',
                "createdAt": "2019-11-02T18:35:41Z",
                "updatedAt": "2019-11-02T18:35:41Z"
            }
        ], {});
    },

    down: (queryInterface, Sequelize) => {
        /*
          Add reverting commands here.
          Return a promise to correctly handle asynchronicity.

          Example:
          */
        return queryInterface.bulkDelete('Playlists', null, {});
    }
};