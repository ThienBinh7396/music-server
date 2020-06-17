const model = require('../models');
const Helper = require('../helpers/helper');
const Status = require('../helpers/status');

const { Users, PublicChats } = model;

const sequelize = require('sequelize');
const Op = sequelize.Op;

const socket = require('../socket');

class PublicChatController {
    findAll(req, res) {
        PublicChats.findAll({
                include: {
                    model: Users,
                    attributes: ['id', 'name', 'thumbnail', 'color']
                }
            })
            .then(rs => {
                res.send(Status.getStatus('success', 'Successful', rs));
            })

    }

    chat(req, res) {
        let provideAttributes = Helper.checkPostProvidedAttribute(req, res, ['content']);

        if (!provideAttributes) return;

        PublicChats.create({
                from: req.user.id,
                content: Helper.escapeText(provideAttributes.content).replace(/\n/gi, '<br>'),
            })
            .then(rs => {
                rs.dataValues.User = req.user;

                socket.send('public-chat', rs.dataValues);

                res.send(Status.getStatus('success', 'Successful', 'ok'));

            })
            .catch(err => {
                console.log(err);
                res.send(Status.getStatus('error', err.errors ? err.errors.map(it => it.message) : "Something went wrong"));
            })

    }
}

module.exports = new PublicChatController();