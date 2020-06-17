const model = require('../models');
const Helper = require('../helpers/helper');
const Status = require('../helpers/status');

const socket = require('../socket');

const sequelize = require('sequelize');
const Op = sequelize.Op;

const { Friends, Users, Messages } = model;



class FriendControllers {
    sendRequest(req, res) {
        let provideAttributes = Helper.checkPostProvidedAttribute(req, res, ['reqId', 'resId']);

        if (!provideAttributes) return;

        return Friends.findAll({
                where: {
                    [Op.or]: [{
                        'requestId': provideAttributes.reqId,
                        'responseId': provideAttributes.resId
                    }, {
                        'requestId': provideAttributes.resId,
                        'responseId': provideAttributes.reqId
                    }]
                }
            }).then(rs => {

                if (rs.length == 0) {
                    Users.findAll({
                            where: {
                                id: {
                                    [Op.in]: [provideAttributes.resId, provideAttributes.reqId]
                                }
                            },
                            attributes: ['id', 'email', 'name', 'thumbnail', 'latestOnline']
                        })
                        .then(users => {
                            if (users.length == 2) {
                                return Friends.create({
                                        requestId: provideAttributes.reqId,
                                        responseId: provideAttributes.resId,
                                        status: 'pending',
                                        time: Date.now()
                                    })
                                    .then(rs => {
                                        res.send(Status.getStatus('success', 'Successful', 'ok'));


                                        let obj = {
                                            id: rs.id,
                                            status: rs.status,
                                            lastMessage: rs.lastMessage,
                                            request: rs.requestId,
                                            state: 'offline',
                                            time: rs.time,
                                            createdAt: rs.createdAt,
                                            updatedAt: rs.updatedAt
                                        }
                                        let rs1 = obj;
                                        rs1.person1 = provideAttributes.reqId;
                                        rs1.person2 = provideAttributes.resId;
                                        rs1.user = (users.filter(it => it.id == provideAttributes.reqId))[0];

                                        let rs2 = obj;
                                        rs1.person1 = provideAttributes.resId;
                                        rs1.person2 = provideAttributes.reqId;
                                        rs1.user = (users.filter(it => it.id == provideAttributes.resId))[0];


                                        socket.send(`friend/${Helper.encryptBase64(provideAttributes.reqId)}`, rs1);
                                        socket.send(`friend/${Helper.encryptBase64(provideAttributes.resId)}`, rs2);

                                    })
                                    .catch(err => {
                                        res.send(Status.getStatus('error', err.errors ? err.errors.map(it => it.message) : "Something went wrong"));
                                    })

                            } else {
                                res.send(Status.getStatus('error', `Can't do this task!`));

                            }

                        })
                        .catch(err => {
                            res.send(Status.getStatus('error', err.errors ? err.errors.map(it => it.message) : "Something went wrong"));
                        })

                } else {
                    res.send(Status.getStatus('error', `Can't do this task!`));
                }



            })
            .catch(err => {
                res.send(Status.getStatus('error', err.errors ? err.errors.map(it => it.message) : "Something went wrong"));
            })


    }

    updateInteraction(req, res) {
        let provideAttributes = Helper.checkPostProvidedAttribute(req, res, ['id', 'type']);

        if (!provideAttributes) return;


        return Friends.findOne({
                where: {
                    id: provideAttributes.id
                }
            })
            .then(friend => {
                if (friend && (req.user.id == friend.requestId || req.user.id == friend.responseId)) {
                    if (provideAttributes.type == 'decline') {
                        socket.send(`cancelInteraction/${Helper.encryptBase64(friend.requestId)}`, friend.id);
                        socket.send(`cancelInteraction/${Helper.encryptBase64(friend.responseId)}`, friend.id);
                    } else
                    if (provideAttributes.type == 'accept') {
                        friend.update({
                                status: 'accept'
                            })
                            .then(updateFriend => {
                                socket.send(`acceptInteraction/${Helper.encryptBase64(friend.requestId)}`, friend.id);
                                socket.send(`acceptInteraction/${Helper.encryptBase64(friend.responseId)}`, friend.id);

                                res.send(Status.getStatus('success', 'Successful', updateFriend));
                            })
                            .catch(err => {


                                res.send(Status.getStatus('error', err.errors ? err.errors.map(it => it.message) : "Something went wrong"));
                            })

                    } else {
                        res.send(Status.getStatus('error', 'Params is invalid!'))
                    }

                } else {
                    res.send(Status.getStatus('error', 'Id not found!'));
                }
            })
            .catch(err => {
                res.send(Status.getStatus('error', err.errors ? err.errors.map(it => it.message) : "Something went wrong"));

            })
    }

    getInteraction(req, res) {
        let provideAttributes = Helper.checkPostProvidedAttribute(req, res, ['interactId']);


        return Friends.findAll({
                where: {
                    [Op.or]: [{
                        'requestId': provideAttributes.interactId,
                    }, {
                        'responseId': provideAttributes.interactId
                    }]
                }
            })
            .then(rs => {
                let interact = {
                    accept: [],
                    pending: [],
                    suggest: []
                };
                let tempInteract = [];


                rs.forEach(it => {
                    let person1 = provideAttributes.interactId;
                    let person2 = it.requestId == provideAttributes.interactId ? it.responseId : it.requestId;
                    let obj = {
                        id: it.id,
                        person1,
                        person2,
                        status: it.status,
                        request: it.requestId,
                        lastMessage: it.lastMessage,
                        state: 'offline',
                        time: it.time,
                        createdAt: it.createdAt,
                        updatedAt: it.updatedAt
                    }

                    tempInteract.push(obj);

                });

                return Users.findAll({
                        where: {
                            id: {
                                [Op.in]: tempInteract.map(it => { return it.person2 })
                            }
                        },
                        attributes: ['id', 'email', 'name', 'thumbnail', 'latestOnline']
                    })
                    .then(users => {

                        tempInteract.forEach((it) => {
                            let index = users.findIndex(user => user.dataValues.id == it.person2);

                            if (index >= 0) {
                                it.user = users[index].dataValues;
                            }

                            if (it.status == 'accept') {
                                interact.accept.push(it);
                            } else {
                                interact.pending.push(it);
                            }

                        })
                        res.send(Status.getStatus('success', 'Successful', interact));



                    })
                    .catch(err => {
                        console.log(err);
                        res.send(Status.getStatus('error', err.errors ? err.errors.map(it => it.message) : "Something went wrong"));

                    })

            })
            .catch(err => {
                res.send(Status.getStatus('error', err.errors ? err.errors.map(it => it.message) : "Something went wrong"));
            })
    }

    cancelInteraction(req, res) {
        let provideAttributes = Helper.checkPostProvidedAttribute(req, res, ['id']);

        if (!provideAttributes) return;

        Friends.findOne({
                where: {
                    id: provideAttributes.id
                }
            })
            .then(friend => {
                if (!friend) {
                    res.send(Status.getStatus('error', 'Id not found!'));
                } else {
                    if (friend.requestId != req.user.id && friend.responseId != req.user.id) {
                        res.send(Status.getStatus('error', 'Permission deny.'));

                    } else {
                        Friends.destroy({
                                where: {
                                    id: provideAttributes.id
                                }
                            })
                            .then(rs => {
                                if (rs == 1) {
                                    socket.send(`cancelInteraction/${Helper.encryptBase64(friend.requestId)}`, friend.id);
                                    socket.send(`cancelInteraction/${Helper.encryptBase64(friend.responseId)}`, friend.id);

                                    res.send(Status.getStatus('success', 'Cancel request friend successfully!'));
                                }
                            })
                            .catch(err => {
                                res.send(Status.getStatus('error', err.errors ? err.errors.map(it => it.message) : "Something went wrong"));

                            })
                    }
                }
            })
            .catch(err => {
                res.send(Status.getStatus('error', err.errors ? err.errors.map(it => it.message) : "Something went wrong"));
            })

    }


}

module.exports = new FriendControllers();