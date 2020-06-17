'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {

        return queryInterface.bulkInsert('Genres', [{
                title: 'Nhạc trẻ',
                href_params: 'Nhac-tre',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                title: 'Nhạc Việt',
                href_params: 'Nhac-Viet',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                title: 'Nhạc Hàn',
                href_params: 'Nhac-Han',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                title: 'Nhạc Âu Mĩ',
                href_params: 'Nhac-Au-Mi',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                title: 'Nhạc Nhật Bản',
                href_params: 'Nhac-Nhat-Ban',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                title: 'Nhạc Không Lời',
                href_params: 'Nhac-Khong-Loi',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                title: 'Nhạc EDM',
                href_params: 'Nhac-EDM',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                title: 'Pop',
                href_params: 'Pop',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                title: 'Rock',
                href_params: 'Rock',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                title: 'Country',
                href_params: 'Country',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                title: 'R&B/Soul',
                href_params: 'RBSoul',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                title: 'Rap',
                href_params: 'Rap',
                createdAt: new Date(),
                updatedAt: new Date()
            },

        ], {});
    },

    down: (queryInterface, Sequelize) => {

        return queryInterface.bulkDelete('Genres', null, {});
    }
};