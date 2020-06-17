const model = require('../models');
const Helper = require('../helpers/helper');
const Status = require('../helpers/status');

const { Genres } = model;

class GenreController {
    add(req, res) {
        let { title } = req.body;

        return Genres.create({
                title: title,
                href_params: Helper.deleteAccent(title)
            })
            .then(rs => {
                res.status(200).send(Status.getStatus('success', 'Create genre successful!', rs));
            })
            .catch(err => {
                res.status(200).send(Status.getStatus('error', err.errors ? err.errors.map(it => it.message) : "Can't add genre"));
            })
    }
    delete(req, res) {
        let { id } = req.body;

        return Genres.destroy({
            where: {
                id: id
            }
        }).then(rs => {
            console.log(rs);
            res.status(200).send(Status.getStatus('success', 'Successful', rs));

        }).catch(err => {
            console.log(err);
            res.status(200).send(Status.getStatus('error', err.errors ? err.errors.map(it => it.message) : "Can't delete genre with identity " + id));
        })
    }

    update(req, res) {
        let { id, title } = req.body;

        return Genres.findOne({
                where: {
                    id: id
                }
            })
            .then(genre => {
                genre.update({
                        title: title || genre.title,
                        href_params: title ? Helper.deleteAccent(title) : genre.href_params
                    })
                    .then(updateGenre => {
                        res.status(200).send(Status.getStatus('success', 'Successful', updateGenre));
                    })
                    .catch(err => {
                        res.status(200).send(Status.getStatus('error', err.errors ? err.errors.map(it => it.message) : "Something went wrong"));
                    })
            })
            .catch(err => {
                res.status(200).send(Status.getStatus('error', 'Update failure'));
            })

    }

    findAll(req, res) {
        return Genres.findAll({
                order: [
                    ['id', 'DESC']
                ]
            })
            .then(rs => {

                res.status(200).send(Status.getStatus('success', 'Successful', rs));
            })
            .catch(err => {
                console.log(err);
                res.status(200).send(Status.getStatus('error', 'Can\'t get records.'))
            })

    }
}

module.exports = new GenreController();