const model = require('../models');
const Helper = require('../helpers/helper');
const Status = require('../helpers/status');

const { Singers } = model;

class SingerController {
    add(req, res) {
        let { banner, name, thumbnail, information } = req.body;
        return Singers.create({
            name,
            bannerHref: banner,
            information: information,
            thumbnail
        }).then(rs => {
            if (rs) {
                res.status(200).send(Status.getStatus('success', 'Successful'));

            } else {
                res.status(200).send(Status.getStatus('error', 'Something went wrong'));
            }
        }).catch(err => {
            console.log(err);
            res.status(200).send(Status.getStatus('error', 'Can\'t create singer'));
        })
    }
    edit(req, res) {
        let { id, name, thumbnail, banner, information, followers } = req.body;

        Singers.findOne({
            where: {
                id: id
            }
        }).then(singer => {
            if (singer) {
                singer.update({
                    name: name || singer.name,
                    thumbnail: thumbnail || singer.thumbnail,
                    information: information || singer.information,
                    bannerHref: banner || singer.bannerHref,
                    followers: followers || singer.followers
                }).then((updatedSinger) => {

                    res.status(200).send(Status.getStatus('success', 'Successful', singer));
                }).catch(err => {
                    res.status(200).send(Status.getStatus('error', err.errors ? err.errors.map(it => it.message) : "Something went wrong"));

                })
            } else {
                res.status(200).send(Status.getStatus('error', 'Can\'t find singer with identity ' + id));
            }
        })

    }

    findAll(req, res) {
        return Singers.findAll()
            .then(rs => {
                res.status(200).send(Status.getStatus('success', 'Successful', rs));
            })
            .catch(err => {
                res.status(200).send(Status.getStatus('error', '[]'));
            })

    }

    findById(req, res) {
        let { id } = req.body;
        return Singers.findOne({
                where: {
                    id: id
                }
            }).then(rs => {
                res.status(200).send(Status.getStatus('success', 'Successful', rs));
            })
            .catch(err => {
                res.status(200).send(Status.getStatus('error', 'Can\'t find singer with identity ' + id, null));
            })
    }
    delete(req, res) {
        let { id } = req.body;
        return Singers.destroy({
            where: {
                id: id
            }
        }).then(rs => {
            console.log(rs);
            res.status(200).send(Status.getStatus('success', 'Successful'));

        }).catch(err => {
            console.log(err);
            res.status(200).send(Status.getStatus('error', 'Can\'t delete singer with identity ' + id));
        })
    }


}

module.exports = new SingerController();