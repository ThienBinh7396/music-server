'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {

        return queryInterface.bulkInsert('Musics', [{
                "title": "Appetizer",
                "thumbnail": "https://res.cloudinary.com/do1xjyyru/image/upload/v1575738518/test/nfznqvykew83v4uabxl3.jpg",
                "lyric": "<p><span style=\"color: rgb(241, 250, 140);\">musics<\/span><\/p>",
                "lyricContributed": "admin",
                "href": "https:\/\/res.cloudinary.com\/do1xjyyru\/video\/upload\/v1572719738\/xxx\/q1rhxxkg2015lwgx8ysi.mp3",
                "duration": "278",
                "active": 1,
                "size": 2000,
                "scope": "public",
                "views": "[]",
                "likes": "[]",
                "uploadId": -1,
                "createdAt": "2019-11-02T18:35:41Z",
                "updatedAt": "2019-11-02T18:35:41Z"

            },
            {
                "title": "Ha hah ah ah ha",
                "thumbnail": "https://res.cloudinary.com/do1xjyyru/image/upload/v1575738518/test/nfznqvykew83v4uabxl3.jpg",
                "lyric": "<p><span style=\"color: rgb(241, 250, 140);\">musics<\/span><\/p>",
                "lyricContributed": "admin",
                "href": "https:\/\/res.cloudinary.com\/do1xjyyru\/video\/upload\/v1572719738\/xxx\/q1rhxxkg2015lwgx8ysi.mp3",
                "duration": "278",
                "size": 2100,
                "active": 1,
                "scope": "public",
                "views": "[]",
                "likes": "[]",
                "uploadId": -1,
                "createdAt": "2019-11-02T18:35:41Z",
                "updatedAt": "2019-11-02T18:35:41Z"

            },
            {
                "title": "Appetizer 12 asd  123",
                "thumbnail": "https://res.cloudinary.com/do1xjyyru/image/upload/v1575738518/test/nfznqvykew83v4uabxl3.jpg",
                "lyric": "<p><span style=\"color: rgb(241, 250, 140);\">musics<\/span><\/p>",
                "lyricContributed": "admin",
                "href": "https:\/\/res.cloudinary.com\/do1xjyyru\/video\/upload\/v1572719738\/xxx\/q1rhxxkg2015lwgx8ysi.mp3",
                "duration": "278",
                "size": 2000,
                "active": 1,
                "scope": "public",
                "views": "[]",
                "likes": "[]",
                "uploadId": -1,
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
          return queryInterface.bulkDelete('People', null, {});
        */
    }
};