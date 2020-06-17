const model = require('../models');
const Helper = require('../helpers/helper');
const Status = require('../helpers/status');
const jwt = require('jsonwebtoken');

const { Users, Employees } = model;

require('dotenv').config();

class Auth {
    async checkToken(req, res) {
        let { token, store, user } = req.body;
        if (token != store || !user || user == '') {
            res.status(201).send(Status.getStatus('error', "Token is invaild"));
            return;
        }


        let decoded;
        try {
            decoded = jwt.verify(token, process.env.SECRET_KEY);
        } catch (err) {
            res.status(201).send(Status.getStatus('error', "Token is invaild"));

            return;
        }


        let { userId, email, type } = decoded;

        if (!userId || !email || !type) {
            res.status(201).send(Status.getStatus('error', "Token is invaild"));
        } else {

            let rs;
            if (type == "client") {

                rs = await Users.findOne({
                    where: {
                        email: email,
                        id: userId
                    },
                    attributes: [
                        'id', 'email', 'thumbnail', 'name'
                    ]
                })
            } else {
                rs = await Employees.findOne({
                    where: {
                        email: email,
                        id: userId
                    },
                    attributes: [
                        'id', 'email', 'thumbnail', 'name'
                    ]
                })
            }



            if (!rs) {
                res.status(201).send(Status.getStatus('error', "Token is invaild"));

            } else {

                res.status(200).send(Status.getStatus('success', 'Success', 'Token valid'))
            }


        }

    }
    async verifyTokenAdmin(req, res, next) {
        await this.vetifyToken(req, res, next, 'admin')
    }
    async verifyTokenClient(req, res, next) {
        await this.vetifyToken(req, res, next, 'client')
    }
    async vetifyToken(req, res, next, typeCheck) {
        const token = req.headers['x-access-token'];

        if (!token) {
            res.status(401).send(Status.getStatus('error', "Token isn't provided!"));
        } else {

            let decoded;
            try {
                decoded = jwt.verify(token, process.env.SECRET_KEY);
            } catch (err) {
                console.log(token);
                res.status(401).send(Status.getStatus('error', "Token is invaild"));

                return;

            }



            let { userId, email, type } = decoded;

            if (!userId || !email || !type || typeCheck != type) {
                res.status(401).send(Status.getStatus('error', "Token is invaild"));
            } else {


                let rs;
                if (type == "client") {

                    rs = await Users.findOne({
                        where: {
                            email: email,
                            id: userId
                        },
                        attributes: [
                            'id', 'email', 'thumbnail', 'name', 'color'
                        ]
                    })
                } else {
                    rs = await Employees.findOne({
                        where: {
                            email: email,
                            id: userId
                        },
                        attributes: [
                            'id', 'email', 'thumbnail', 'name'
                        ]
                    })
                }



                if (!rs) {
                    res.status(401).send(Status.getStatus('error', "Token is invaild"));

                } else {

                    let { id, name, email, thumbnail, color } = rs;


                    req.user = { id, name, email, thumbnail, type: typeCheck, color: color || '#ff00ff' };

                    next();
                }


            }


        }

    }


}

module.exports = new Auth();