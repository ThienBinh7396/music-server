const model = require('../models/index');
const Status = require('../helpers/status');
const Helper = require('../helpers/helper');

const { Playlists, PlaylistCategories, Musics, MapSingerMusics, Singers, Genres, MapGenreMusics, MapPlaylistMusics } = model;

class PlaylistController {
    async findPlaylistById(id) {
        return new Promise(res => {
            Playlists.findOne({
                    include: [{
                        model: PlaylistCategories
                    }, {
                        model: Musics,
                        as: 'musics',
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
                        ],
                        through: {
                            model: MapPlaylistMusics
                        }
                    }],
                    where: {
                        id: id
                    }
                })
                .then(rs => {
                    res(rs);
                }).catch(err => {
                    console.log(err)
                    res(null);
                })

        })

    }

    findOne(req, res) {
        let provideAttributes = Helper.checkPostProvidedAttribute(req, res, ['id']);

        if (!provideAttributes) return;


        return Playlists.findOne({
                where: {
                    id: provideAttributes.id
                },
                include: [{
                    model: PlaylistCategories
                }, {
                    model: Musics,
                    as: 'musics',
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
                    ],
                    through: {
                        model: MapPlaylistMusics
                    }
                }],
            })
            .then(rs => {
                if (!rs) {
                    return res.send(Status.getStatus('error', `The playlist id was not found`));
                }

                if (rs.ownerId == -1 || rs.scope == 'public') {
                    res.send(Status.getStatus('success', 'Successful', rs));

                } else {
                    if (rs.ownerId == req.user.id && req.user.type == 'client') {
                        res.send(Status.getStatus('success', 'Successful', rs));

                    } else {
                        res.send(Status.getStatus('error', 'Permission denied'));
                    }

                }

            })
            .catch(err => {
                console.log(err);
                res.send(Status.getStatus('error', err.errors ? err.errors.map(it => it.message) : "Something went wrong"));
            })




    }

    findAll(req, res) {
        return Playlists.findAll({
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
            order: [
                ['id', 'DESC']
            ]
        }).then(rs => {

            res.status(200).send(Status.getStatus('success', 'Success', rs));
        }).catch(err => {
            console.log(err)

            res.status(200).send(Status.getStatus('error', err.errors ? err.errors.map(it => it.message) : "Something went wrong"));
        })
    }

    async mapMusicIntoPlaylist(playlistId, musics) {
        return new Promise(res => {
            MapPlaylistMusics.destroy({
                    where: {
                        playlistId: playlistId
                    }
                })
                .then(destroy => {
                    MapPlaylistMusics.bulkCreate(musics.map(it => {
                            return {
                                playlistId: playlistId,
                                musicId: it
                            }
                        }))
                        .then(result => {
                            res(result);
                        })
                        .catch(err => {
                            console.log(err);
                            res(false);
                        })

                })
                .catch(err => {
                    res(false);
                })


        });
    }

    async deleteError(playlistId) {
        return new Promise(res => {
            MapPlaylistMusics.destroy({
                    where: {
                        id: playlistId
                    }
                })
                .then(rs => {
                    Playlists.destroy({
                            where: {
                                id: playlistId
                            }
                        }).then(rs => {
                            res()
                        })
                        .catch(err => {
                            res(err);
                        })
                })
                .catch(err => {
                    res(err);
                })
        })
    }

    add(req, res) {
        let provideAttributes = Helper.checkPostProvidedAttribute(req, res, ['title', 'thumbnail', 'scope', 'playlistCategory', 'musics']);

        if (!provideAttributes) return;


        let category = req.user.type == 'client' ? 1 : provideAttributes.playlistCategory;

        let ownerId = req.user.type == 'admin' ? -1 : req.user.id;


        return Playlists.create({
            title: provideAttributes.title,
            description: req.body.description,
            thumbnail: provideAttributes.thumbnail,
            ownerId,
            playlistCategory: category,
            scope: provideAttributes.scope,
            views: '[]'
        }).then(async playlist => {
            let resultMapMusic = await this.mapMusicIntoPlaylist(playlist.id, JSON.parse(provideAttributes.musics));

            console.log(playlist);
            console.log(resultMapMusic);

            if (!resultMapMusic) {
                await this.deleteError(playlist.id);

                res.send(Status.getStatus('error', "Add playlist faildure!"));
            } else {
                res.send(Status.getStatus('success', 'Add playlist successful', await this.findPlaylistById(playlist.id)));
            }
        }).catch(err => {

            res.status(200).send(Status.getStatus('error', err.errors ? err.errors.map(it => it.message) : "Something went wrong"));
        })
    }
    likePlaylist(req, res) {
        let provideAttributes = Helper.checkPostProvidedAttribute(req, res, ['id']);

        if (!provideAttributes) return;

        Playlists.findOne({
                where: {
                    id: provideAttributes.id
                }
            })
            .then(async playlist => {
                let likes = JSON.parse(playlist.likes);

                let index = likes.findIndex(it => it == req.user.id);

                if (index >= 0) {
                    likes.splice(index, 1);
                } else {
                    likes.push(req.user.id);

                }

                likes = JSON.stringify(likes);
                playlist.update({
                        likes: likes
                    })
                    .then(async us => {
                        res.status(200).send(Status.getStatus('success', `Update playlist successful with identity ${provideAttributes.id}`, likes));
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(200).send(Status.getStatus('error', err.errors ? err.errors.map(it => it.message) : "Something went wrong"));
                    })


            })
    }

    edit(req, res) {
        let provideAttributes = Helper.checkPostProvidedAttribute(req, res, ['id']);

        if (!provideAttributes) return;


        Playlists.findOne({
                where: {
                    id: provideAttributes.id
                }
            })
            .then(async playlist => {
                if (!playlist) {

                    res.send(Status.getStatus('error', `Can't find music with identity ${provideAttributes.id}`));
                    return;
                }

                let { title, description, thumbnail, scope, playlistCategory, views, musics } = req.body;

                if (musics) {
                    try {
                        musics = JSON.parse(musics);

                        await this.mapMusicIntoPlaylist(provideAttributes.id, musics);

                    } catch (err) {
                        console.log("Musics is invalid");


                    }

                }

                playlist.update({
                        title: title || playlist.title,
                        description: description || playlist.description,
                        thumbnail: thumbnail || playlist.thumbnail,
                        scope: scope || playlist.scope,
                        playlistCategory: playlistCategory || playlist.playlistCategory,
                        views: views || playlist.views
                    })
                    .then(async us => {
                        let rs = await this.findPlaylistById(provideAttributes.id);

                        res.status(200).send(Status.getStatus('success', `Update playlist successful with identity ${provideAttributes.id}`, rs));
                    })
                    .catch(err => {
                        res.status(200).send(Status.getStatus('error', err.errors ? err.errors.map(it => it.message) : "Something went wrong"));
                    })

            })
            .catch(err => {
                console.log(err)
                res.status(200).send(Status.getStatus('error', err.errors ? err.errors.map(it => it.message) : "Something went wrong"));
            })
    }

    delete(req, res) {
        let provideAttributes = Helper.checkPostProvidedAttribute(req, res, ['id']);

        if (!provideAttributes) return;

        return MapPlaylistMusics.destroy({
                where: {
                    playlistId: provideAttributes.id
                }
            })
            .then(rsM => {
                Playlists.destroy({
                        where: {
                            id: provideAttributes.id
                        }
                    })
                    .then(playlist => {
                        if (playlist != 0) {
                            res.status(200).send(Status.getStatus('success', `Delete playlist successful with identity ${provideAttributes.id}`));

                        } else {
                            res.status(200).send(Status.getStatus('error', `Cant't find playlist with identity ${provideAttributes.id}`));

                        }

                    })
                    .catch(err => {
                        console.log(err);
                        res.status(200).send(Status.getStatus('error', err.errors ? err.errors.map(it => it.message) : "Something went wrong"));

                    })
            })
            .catch(err => {
                console.log(err);
                res.status(200).send(Status.getStatus('error', err.errors ? err.errors.map(it => it.message) : "Something went wrong"));

            })
    }
}

module.exports = new PlaylistController();