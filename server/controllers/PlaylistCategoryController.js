const model = require('../models');
const Status = require('../helpers/status');
const Helper = require('../helpers/helper');

const sequelize = require('sequelize');
const Op = sequelize.Op;

const { PlaylistCategories, Playlists, Musics, Singers, MapSingerMusics, Genres, MapGenreMusics, MapPlaylistMusics } = model;

class PlaylistCategoryController {
    findById(req, res) {
        let provideAttributes = Helper.checkPostProvidedAttribute(req, res, ['id']);

        if (!provideAttributes) return;

        return PlaylistCategories.findOne({
                where: {
                    id: provideAttributes.id
                },
                include: [{
                    model: Playlists,
                    include: [{
                        model: PlaylistCategories
                    }, {
                        model: Musics,
                        as: 'musics',
                        through: {
                            model: MapPlaylistMusics
                        },
                        include: [{
                                model: Genres,
                                as: 'genres',
                                attributes: ['id', 'title', 'href_params'],
                                through: {
                                    model: MapGenreMusics,
                                }

                            },
                            {
                                model: Singers,
                                as: 'singers',
                                attributes: ['id', 'name', 'thumbnail'],
                                through: {
                                    model: MapSingerMusics
                                }

                            }
                        ]



                    }],
                }]
            })
            .then(playlistCategory => {
                res.send(Status.getStatus('success', 'Successful', playlistCategory));
            })
            .catch(err => {
                res.send(Status.getStatus('error', err.errors ? err.errors.map(it => it.message) : "Something went wrong"));
            })


    }

    find(req, res) {
        let provideAttributes = Helper.checkPostProvidedAttribute(req, res, ['random', 'limit']);

        if (!provideAttributes) return;


        let configSelect = {
            where: {
                id: {
                    [Op.ne]: 1
                }
            },
            include: [{
                model: Playlists,
                include: [{
                    model: PlaylistCategories
                }, {
                    model: Musics,
                    as: 'musics',
                    through: {
                        model: MapPlaylistMusics
                    },
                    include: [{
                        model: Genres,
                        as: 'genres',
                        required: false,
                        attributes: ['id', 'title', 'href_params']
                    }, {
                        model: Singers,
                        as: 'singers',
                        required: false,
                        attributes: ['id', 'name', 'thumbnail'],
                    }]
                }],
            }]
        };


        if (JSON.parse(provideAttributes.random)) {
            configSelect.order = sequelize.literal('random()');
        }

        if (provideAttributes.limit != -1) {
            configSelect.limit = provideAttributes.limit;
        }

        console.log(provideAttributes);
        console.log(configSelect);

        return PlaylistCategories.findAll(configSelect)
            .then(rs => {
                res.send(Status.getStatus('success', 'Successful', rs));
            })
            .catch(err => {
                console.log(err);

                res.send(Status.getStatus('error', err.errors ? err.errors.map(it => it.message) : "Something went wrong"));
            })

    }

    findAll(req, res) {
        let provideAttribute = Helper.checkPostProvidedAttribute(req, res, ['type']);

        if (!provideAttribute) return;

        switch (provideAttribute.type) {
            case 'all':
                {
                    PlaylistCategories.findAll({
                        order: [
                            ['id', 'DESC']
                        ]
                    })
                    .then(rs => {
                        res.status(200).send(Status.getStatus('success', 'Successful', rs));
                    })
                    .catch(err => {
                        res.status(200).send(Status.getStatus('error', err.errors ? err.errors.map(it => it.message) : "Something went wrong"));
                    })
                    break;
                }
            case 'withoutUser':
                {
                    PlaylistCategories.findAll({
                        where: {
                            userPlaylist: 0
                        },
                        order: [
                            ['id', 'DESC']
                        ]
                    }).then(rs => {
                        res.status(200).send(Status.getStatus('success', 'Successful', rs));
                    })
                    .catch(err => {
                        res.status(200).send(Status.getStatus('error', err.errors ? err.errors.map(it => it.message) : "Something went wrong"));
                    });

                    break;

                }

            default:
                {
                    res.status(200).send(Status.getStatus('error', 'Playlist category is invalid!'));


                    break;
                }
        }

    }

    add(req, res) {
        let provideAttributes = Helper.checkPostProvidedAttribute(req, res, ['title', 'description']);

        if (!provideAttributes) return;

        PlaylistCategories.create({
                title: provideAttributes.title,
                description: provideAttributes.description,
                userPlaylist: 0
            })
            .then(rs => {
                res.status(200).send(Status.getStatus('success', 'Successful', rs));
            })
            .catch(err => {
                res.status(200).send(Status.getStatus('error', err.errors ? err.errors.map(it => it.message) : "Something went wrong"));
            });
    }
    edit(req, res) {
        let provideAttributes = Helper.checkPostProvidedAttribute(req, res, ['id']);

        if (!provideAttributes) return;

        PlaylistCategories.findOne({
            where: {
                id: provideAttributes.id
            }
        }).then(playlistCategory => {

            let { title, description } = req.body;

            playlistCategory.update({
                    title: title || playlistCategory.title,
                    description: description || playlistCategory.description,
                })
                .then(rs => {
                    res.status(200).send(Status.getStatus('success', 'Successful', rs));
                })
                .catch(err => {
                    res.status(200).send(Status.getStatus('error', err.errors ? err.errors.map(it => it.message) : "Something went wrong"));
                });
        })
    }

    delete(req, res) {
        let provideAttributes = Helper.checkPostProvidedAttribute(req, res, ['id']);

        if (!provideAttributes) return;


        PlaylistCategories.findOne({
                where: {
                    id: provideAttributes.id
                }
            }).then(playlistCategory => {
                if (!playlistCategory) {
                    res.status(200).send(Status.getStatus('error', `Can't find category with identity ${provideAttributes.id}`));
                    return;
                }

                if (playlistCategory.userPlaylist == 1) {
                    res.status(200).send(Status.getStatus('error', "Can't delete"));
                    return;
                }


                return PlaylistCategories.destroy({
                        where: {
                            id: provideAttributes.id
                        }
                    }).then(deleteRs => {
                        console.log(deleteRs);

                        res.status(200).send(Status.getStatus('success', `Delete category with identity ${provideAttributes.id} successful`));

                    })
                    .catch(err => {
                        res.status(200).send(Status.getStatus('error', err.errors ? err.errors.map(it => it.message) : "Something went wrong"));

                    })



            })
            .catch(err => {
                res.status(200).send(Status.getStatus('error', err.errors ? err.errors.map(it => it.message) : "Something went wrong"));
            });
    }
}
module.exports = new PlaylistCategoryController();