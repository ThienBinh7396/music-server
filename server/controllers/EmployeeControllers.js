const model = require('../models');
const Helper = require('../helpers/helper');
const Status = require('../helpers/status');

const { Employees } = model;

class EmployeeController {
    createEmployee(req, res) {
        let { email, name, password, phone, address } = req.body;


        return Employees.create({
            name: name,
            email: email,
            password: Helper.hashPassword(password)
        }).then(rs => {

            if (rs) {
                let { id, email, name, thumbnail } = rs;

                console.log(id, email, name, thumbnail)
                res.status(200).send(Status.getStatus('success', 'Successful', { id, email, name, thumbnail }));

            } else {
                res.status(200).send(Status.getStatus('warnign', 'Email is already exists. Something went wrong'));
            }
        }).catch(err => {

            res.status(200).send(Status.getStatus('error', err.errors ? err.errors.map(it => it.message) : "Something went wrong"));
        })
    }


    checkLogin(req, res) {
        const { email, password } = req.body;


        return Employees.findOne({
            where: {
                email: email,
                password: Helper.hashPassword(password)
            },
            attributes: ['id', 'email', 'thumbnail', 'name', 'address', 'phone']
        }).then(rs => {
            if (rs) {
                let { id, email, thumbnail, name, phone, address } = rs;
                var token = Helper.generateTokenById(id, 'admin', email, thumbnail, name);
                var u = Helper.encryptBase64(JSON.stringify({ id, type: 'admin', email, thumbnail, name, phone, address }));
                res.status(200).send(Status.getStatus('success', 'Successful', { token, u }));
            } else {
                res.status(200).send(Status.getStatus('warning', 'Invalid email or password'));
            }
        }).catch(err => {
            res.status(200).send(Status.getStatus('error', err.errors ? err.errors.map(it => it.message) : "Something went wrong"));
        })

    }


    updateEmployee(req, res) {

        const { id, name, thumbnail, email, password, phone, address } = req.body;

        if (!id || id != req.user.id) {
            res.status(200).send(Status.getStatus('error', "Invalid id"));
        } else {
            return Employees.findOne({
                where: {
                    id: id,
                },
            }).then(employee => {

                employee.update({
                    name: name || employee.name,
                    phone: phone || employee.phone,
                    address: address || employee.address,
                    thumbnail: thumbnail || employee.thumbnail,
                    email: email || employee.email,
                    password: (password ? Helper.hashPassword(password) : employee.password)
                }).then((updatedEmployee) => {

                    res.status(200).send(Status.getStatus('success', 'Successful'));
                }).catch(err => {
                    res.status(200).send(Status.getStatus('error', err.errors ? err.errors.map(it => it.message) : "Something went wrong"));

                })
            })


        }

    }
}

module.exports = new EmployeeController();