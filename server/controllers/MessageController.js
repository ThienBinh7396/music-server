const model = require('../models');
const Helper = require('../helpers/helper');
const Status = require('../helpers/status');

const socket = require('../socket');

const { Messages, Friends } = model;

const sequelize = require('sequelize');
const Op = sequelize.Op;

class MessageController {
    getMessage(req, res) {
        let provideAttributes = Helper.checkPostProvidedAttribute(req, res, ['person1', 'person2']);

        if (!provideAttributes) return;

        return Messages.findAll({
                where: {
                    [Op.or]: [{
                        'fromId': provideAttributes.person1,
                        'toId': provideAttributes.person2
                    }, {
                        'toId': provideAttributes.person1,
                        'fromId': provideAttributes.person2
                    }]
                }
            })
            .then(rs => {
                res.send(Status.getStatus('success', 'Successful', rs));
            })
            .catch(err => {
                res.send(Status.getStatus('error', err.errors ? err.errors.map(it => it.message) : "Something went wrong"));

            })

    }

    sendMessage(req, res) {
        let provideAttributes = Helper.checkPostProvidedAttribute(req, res, ['toId', 'content']);

        if (!provideAttributes) return;

        let now = Date.now();

        return Messages.create({
                fromId: req.user.id,
                toId: provideAttributes.toId,
                content: Helper.escapeText(provideAttributes.content),
                time: now,
                view: 0
            })
            .then(rs => {
                socket.send(`chat/${Helper.encryptBase64(req.user.id)}`, rs);
                socket.send(`chat/${Helper.encryptBase64(provideAttributes.toId)}`, rs);

                res.send(Status.getStatus('success', 'Successful', 'ok'));

                Friends.update({
                    lastMessage: provideAttributes.content
                }, {
                    where: {
                        [Op.or]: [{
                            requestId: provideAttributes.toId,
                            responseId: req.user.id
                        }, {
                            responseId: provideAttributes.toId,
                            requestId: req.user.id

                        }]
                    }
                })
            })
            .catch(err => {
                res.send(Status.getStatus('error', err.errors ? err.errors.map(it => it.message) : "Something went wrong"));
            })

    }
}

module.exports = new MessageController();