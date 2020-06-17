const model = require('../models');
const Helper = require('../helpers/helper');
const Status = require('../helpers/status');

const { Users, Musics, MapGenreMusics, MapSingerMusics, Genres, Singers, MusicComment } = model;

const sequelize = require('sequelize');
const Op = sequelize.Op;

class MusicController {
    count(req, res) {
        Musics.findAll({
                attributes: [
                    [sequelize.fn('count', sequelize.col('*')), 'count']
                ],
            })
            .then(rs => {
                res.send(Status.getStatus('success', 'Successful', rs));
            })
            .catch(err => {

                res.status(200).send(Status.getStatus('error', err.errors ? err.errors.map(it => it.message) : "Something went wrong"));
            })
    }

    topListener(req, res) {
        Musics.findAll()
            .then(musics => {
                let statistic = [];

                musics.forEach(music => {

                    let amount = 0;
                    JSON.parse(music.listeners).forEach(it => {
                        amount += it.amount
                    })
                    let obj = {...music.dataValues };
                    obj.amountListen = amount;
                    statistic.push(obj)

                });
                statistic.sort((a, b) => {
                    return -a.amountListen + b.amountListen;
                })

                res.send(Status.getStatus('success', 'Successful', statistic.splice(0, 5)));
            })
            .catch(err => {
                console.log(err);
                res.status(200).send(Status.getStatus('error', err.errors ? err.errors.map(it => it.message) : "Something went wrong"));
            })
    }

    topDownload(req, res) {
        Musics.findAll({
                order: [
                    ['download', 'DESC']
                ],
                limit: 5,
            })
            .then(rs => {
                res.send(Status.getStatus('success', 'Successful', rs));
            })
    }

    findInList(req, res) {
        let provideAttributes = Helper.checkPostProvidedAttribute(req, res, ['list']);

        if (!provideAttributes) return;

        console.log(provideAttributes.list);
        return Musics.findAll({
                where: {
                    id: {
                        [Op.in]: provideAttributes.list
                    }
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
            })
            .then(rs => {
                res.send(Status.getStatus('success', 'Successful', rs));

            })
    }

    findOne(req, res) {
        let provideAttribute = Helper.checkPostProvidedAttribute(req, res, ['id']);

        if (!provideAttribute) return;

        return Musics.findOne({
                where: {
                    id: provideAttribute.id
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
            })
            .then(music => {
                if ((music.scope == 'public' || music.uploadId == req.user.id) || req.user.type == 'admin') {
                    res.send(Status.getStatus('success', 'Successful', music));
                } else {
                    res.send(Status.getStatus('error', 'Permission denied!'));
                }


            })
            .catch(err => {
                res.send(Status.getStatus('error', err.errors ? err.errors.map(it => it.message) : "Something went wrong"));
            })

    }

    findById(req, res) {
        let provideAttribute = Helper.checkPostProvidedAttribute(req, res, ['id']);

        if (!provideAttribute) return;

        return Musics.findOne({
                where: {
                    id: provideAttribute.id
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
            })
            .then(rs => {
                res.status(200).send(Status.getStatus('success', 'Successful', rs));
            })
            .catch(err => {
                res.status(200).send(Status.getStatus('error', err.errors ? err.errors.map(it => it.message) : "Something went wrong"));
            })

    }

    findAll(req, res) {
        return Musics.findAll({
                include: [{
                        model: Genres,
                        as: 'genres',
                        required: false,
                        attributes: ['id', 'title', 'href_params'],
                        through: {
                            model: MapGenreMusics,
                        }

                    },
                    {
                        model: Singers,
                        as: 'singers',
                        required: false,
                        attributes: ['id', 'name', 'thumbnail'],
                        through: {
                            model: MapSingerMusics
                        }

                    }
                ]
            })
            .then(rs => {

                res.status(200).send(Status.getStatus('success', 'Successful', rs));
            })

    }
    async helperDatabase(musicId, genre, singer) {
        return new Promise(res => {
            console.log(musicId);

            MapGenreMusics.destroy({
                    where: {
                        musicId: musicId
                    }
                })
                .then(rs => {
                    MapSingerMusics.destroy({
                            where: {
                                musicId: musicId
                            }
                        }).then(rs => {
                            MapGenreMusics.bulkCreate(genre)
                                .then(genreRs => {
                                    MapSingerMusics.bulkCreate(singer)
                                        .then(singerRs => {
                                            res(true);

                                        })
                                        .catch(err => {
                                            res(false);
                                        })

                                })
                                .catch(err => {
                                    res(false);
                                })


                        })
                        .catch(err => {
                            res(false);
                        })

                })
                .catch(err => {
                    res(false);
                })


        })

    }

    add(req, res) {
        console.log(req.body);
        let provideAttribute = Helper.checkPostProvidedAttribute(req, res, ["title", "thumbnail", "lyric", "href", "duration", "size", "scope", "genre", "singer"]);

        if (!provideAttribute) return;

        let active = req.user.type == 'admin' ? 1 : 0;

        let lyricContributed = req.user.type == 'admin' ? 'admin' : req.user.name;

        let uploadId = req.user.type == 'admin' ? -1 : req.user.id;

        return Musics.create({
            title: provideAttribute.title,
            thumbnail: provideAttribute.thumbnail,
            lyric: provideAttribute.lyric,
            lyricContributed,
            href: provideAttribute.href,
            duration: provideAttribute.duration,
            size: provideAttribute.size,
            active,
            scope: provideAttribute.scope,
            uploadId
        }).then(async rs => {
            console.log(rs);

            let genre = JSON.parse(provideAttribute.genre);

            genre = genre.map(it => {
                return {
                    genreId: it,
                    musicId: rs.id
                }
            })

            let singer = JSON.parse(provideAttribute.singer);

            singer = singer.map(it => {
                return {
                    singerId: it,
                    musicId: rs.id
                }
            })

            let uploadNavigation = await this.helperDatabase(rs.id, genre, singer);
            console.log(uploadNavigation);

            console.log("End");

            res.send(Status.getStatus('success', 'Add music successful width identity ' + rs.id, rs));
        })
    }

    edit(req, res) {
        let provideAttribute = Helper.checkPostProvidedAttribute(req, res, ["id"]);

        if (!provideAttribute) {
            return;
        }

        return Musics.findOne({
            where: {
                id: provideAttribute.id
            },
            include: [{
                    model: Genres,
                    as: 'genres',
                    required: false,
                    attributes: ['id', 'title', 'href_params'],
                    through: {
                        model: MapGenreMusics,
                    }

                },
                {
                    model: Singers,
                    as: 'singers',
                    required: false,
                    attributes: ['id', 'name', 'thumbnail'],
                    through: {
                        model: MapSingerMusics
                    }

                }
            ]
        }).then(music => {
            if (!music) {
                res.status(200).send(Status.getStatus('error', `Can't find music with identity ${provideAttribute.id}`));
                return;
            }

            let { title, thumbnail, lyric, lyricContributed, href, duration, size, active, scope, views, likes } = req.body;


            music.update({
                    title: title || music.title,
                    thumbnail: thumbnail || music.thumbnail,
                    lyric: lyric || music.lyric,
                    lyricContributed: lyricContributed || music.lyricContributed,
                    href: href || music.href,
                    duration: duration || music.duration,
                    size: size || music.size,
                    active: active || music.active,
                    scope: scope || music.scope,
                    views: views || music.views,
                    likes: likes || music.likes
                })
                .then(async musicUpdate => {

                    let oldGenres = (req.body.genre ? JSON.parse(req.body.genre) : music.genres.map(it => {
                        return it.id;
                    })).map(it => {
                        return {
                            musicId: provideAttribute.id,
                            genreId: it
                        }
                    });


                    let oldSingers = (req.body.singer ? JSON.parse(req.body.singer) : music.singers.map(it => {
                        return it.id;
                    })).map(it => {
                        return {
                            musicId: provideAttribute.id,
                            singerId: it
                        }
                    });

                    if (req.body.genre || req.body.singer) {
                        await this.helperDatabase(provideAttribute.id, oldGenres, oldSingers);

                        console.log('end')

                    }

                    console.log(oldGenres.length, oldSingers.length);


                    res.status(200).send(Status.getStatus('success', `Edit music successful with identity ${provideAttribute.id}`, music));
                })


        })

    }

    delete(req, res) {
        let provideAttribute = Helper.checkPostProvidedAttribute(req, res, ['id']);

        if (!provideAttribute) {
            return;
        }

        Musics.findOne({
                where: {
                    id: provideAttribute.id
                }
            })
            .then(music => {
                if (!music) {
                    res.status(200).send(Status.getStatus('error', `Can't find music with identity ${provideAttribute.id}`));

                    return;
                }

                if (req.user.type != 'admin' && music.uploadId != req.user.id) {
                    res.status(200).send(Status.getStatus('error', 'Permission denied'));
                    return;

                }

                MapGenreMusics.destroy({
                        where: {
                            'musicId': provideAttribute.id
                        }
                    })
                    .then(rs => {
                        MapSingerMusics.destroy({
                                where: {
                                    musicId: provideAttribute.id
                                }
                            }).then(rs => {
                                Musics.destroy({
                                        where: {
                                            id: provideAttribute.id
                                        }
                                    })
                                    .then(deleteRs => {
                                        console.log(deleteRs);

                                        res.status(200).send(Status.getStatus('success', `Delete music with identity ${provideAttribute.id} successful`));

                                    })
                                    .catch(err => {
                                        res.status(200).send(Status.getStatus('error', err.errors ? err.errors.map(it => it.message) : "Something went wrong"));

                                    })


                            })
                            .catch(err => {
                                res.status(200).send(Status.getStatus('error', err.errors ? err.errors.map(it => it.message) : "Something went wrong"));
                            })
                    })
                    .catch(err => {
                        res.status(200).send(Status.getStatus('error', err.errors ? err.errors.map(it => it.message) : "Something went wrong"));
                    })
            })

    }


    like(req, res) {
        let provideAttribute = Helper.checkPostProvidedAttribute(req, res, ['musicId', 'like']);

        if (!provideAttribute) return;

        if (req.user.type == 'admin') {
            return res.send(Status.getStatus('error', 'This API for client'));
        }

        return Musics.findOne({
                where: {
                    id: provideAttribute.musicId
                }
            })
            .then(music => {
                if (!music) {
                    res.send(Status.getStatus('error', 'No identity of music was found!'));
                } else {
                    let { likes } = music;

                    likes = JSON.parse(likes);

                    let index = likes.indexOf(req.user.id);

                    if (provideAttribute.like == true) {
                        if (index < 0) {
                            likes.push(req.user.id);
                        }
                    } else {
                        if (index >= 0) {
                            likes.splice(index, 1);
                        }
                    }

                    likes = JSON.stringify(likes);
                    music.update({
                            likes: likes
                        })
                        .then(rs => {
                            music.likes = likes;
                            res.send(Status.getStatus('success', 'Successful', music));
                        })
                }

            })
            .catch(err => {
                res.send(Status.getStatus('error', err.errors ? err.errors.map(it => it.message) : "Something went wrong"));
            })
    }

    getCommentByMusicId(req, res) {
        let provideAttribute = Helper.checkPostProvidedAttribute(req, res, ['musicId']);

        if (!provideAttribute) return;

        return Musics.findOne({
                where: {
                    id: provideAttribute.musicId
                }
            })
            .then(music => {
                if (!music) {
                    res.send(Status.getStatus('error', 'No identity of music was found!'));

                } else {
                    if (music.scope == 'public' || music.uploadId == req.user.id) {
                        MusicComment.findAll({
                                where: {
                                    musicId: provideAttribute.musicId
                                },
                                include: {
                                    model: Users,
                                    attributes: ['id', 'name', 'thumbnail']
                                },
                                order: [
                                    ['time', 'ASC']
                                ]
                            })
                            .then(comments => {
                                let index = 0;

                                while (index < comments.length) {
                                    if (comments[index].parentId != 0) {
                                        let parentIndex = comments.findIndex(it => it.id == comments[index].parentId);

                                        if (parentIndex >= 0) {
                                            if (!comments[parentIndex].dataValues.subs) {
                                                comments[parentIndex].dataValues.subs = [];
                                            }

                                            comments[parentIndex].dataValues.subs.push(comments[index]);

                                            comments.splice(index, 1);
                                            continue;
                                        }

                                    } else {
                                        if (!comments[index].dataValues.subs)
                                            comments[index].dataValues.subs = [];
                                    }


                                    index++;
                                }

                                res.send(Status.getStatus('success', 'Successful', comments));
                            })
                            .catch(err => {
                                console.log(err);
                                res.send(Status.getStatus('error', err.errors ? err.errors.map(it => it.message) : "Something went wrong"));
                            })


                    } else {
                        res.send(Status.getStatus('error', 'This music is private!'));
                    }
                }
            })
            .catch(err => {
                res.send(Status.getStatus('error', err.errors ? err.errors.map(it => it.message) : "Something went wrong"));
            })

    }

    updateListenerToMusic(req, res) {
        let provideAttribute = Helper.checkPostProvidedAttribute(req, res, ['id']);

        if (!provideAttribute) return;

        Musics.findOne({
                where: {
                    id: provideAttribute.id
                }
            })
            .then(music => {
                let listeners = JSON.parse(music.listeners);

                let index = listeners.findIndex(it => it.id == req.user.id);

                if (index < 0) {
                    listeners.push({
                        id: req.user.id,
                        amount: 1
                    })
                } else {
                    listeners[index].amount += 1
                }

                listeners = JSON.stringify(listeners);

                music.update({
                        listeners: listeners
                    })
                    .then(updateMusic => {
                        res.send(Status.getStatus('success', 'Successful', updateMusic));
                    })
                    .catch(err => {
                        res.send(Status.getStatus('error', err.errors ? err.errors.map(it => it.message) : "Something went wrong"));
                    })
            })

    }

    commentInMusic(req, res) {
        let provideAttribute = Helper.checkPostProvidedAttribute(req, res, ['musicId', 'content', 'parentId']);

        if (!provideAttribute) return;

        if (req.user.type == 'admin') {
            return res.send(Status.getStatus('error', 'This API for client'));
        }

        return Musics.findOne({
                where: {
                    id: provideAttribute.musicId
                }
            })
            .then(music => {
                if (!music) {
                    res.send(Status.getStatus('error', 'No identity of music was found!'));

                } else {
                    if (music.scope == 'public' || music.uploadId == req.user.id) {
                        console.log(Helper.escapeText(provideAttribute.content).replace(/\n/gi, '<br>'));

                        MusicComment.create({
                                musicId: provideAttribute.musicId,
                                userID: req.user.id,
                                content: Helper.escapeText(provideAttribute.content).replace(/\n/gi, '<br>'),
                                parentId: provideAttribute.parentId,
                                time: Date.now()
                            })
                            .then(rs => {
                                res.send(Status.getStatus('success', 'Successful', rs));
                            })
                            .catch(err => {
                                res.send(Status.getStatus('error', err.errors ? err.errors.map(it => it.message) : "Something went wrong"));
                            })

                    } else {
                        res.send(Status.getStatus('error', 'This music is private!'));
                    }

                }

            })
            .catch(err => {
                res.send(Status.getStatus('error', err.errors ? err.errors.map(it => it.message) : "Something went wrong"));

            })

    }

}

module.exports = new MusicController();