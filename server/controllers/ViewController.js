const model = require('../models');
const Helper = require('../helpers/helper');
const Status = require('../helpers/status');

const sequelize = require('sequelize');
const Op = sequelize.Op;

const { Views } = model;

const monthInYears = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",

];

class ViewController {
    rangeInDay() {
        let from = new Date(new Date().setHours(0, 0, 0));
        let to = new Date(new Date().setHours(23, 59, 59));

        return [from, to];

    }

    rangeInWeek() {
        let now = new Date();

        let year = now.getFullYear();
        let month = now.getMonth();
        let date = now.getDate();
        let day = now.getDay();

        let diff = date - day;

        let monday = new Date().setDate(diff + 1);
        let sunday = new Date().setDate(diff + 7);



        return [`${new Date(monday)}`, `${new Date(sunday)}`];
    }

    rangeInYear() {
        let year = new Date().getFullYear();

        let from = new Date();
        from.setFullYear(year, 0, 1);
        from.setHours(0, 0, 0);

        let to = new Date();
        to.setFullYear(year, 11, 31);
        to.setHours(23, 59, 59);

        return [Helper.formatDateByString(from).sqlTime, Helper.formatDateByString(to).sqlTime];

    }

    async createNewRecord() {
        return new Promise(res => {
            Views.create({
                    list: '[]'
                })
                .then(rs => {
                    res(rs);
                })
                .catch(err => {
                    res(null);
                })
        })
    }


    userVisit(req, res) {

        Views.findAll({
                where: {
                    createdAt: {
                        [Op.between]: this.rangeInDay()
                    }
                }
            })
            .then(async record => {
                let data = null;
                if (record.length == 0) {
                    data = await this.createNewRecord();
                }

                let id = data ? data.id : record[0].id;
                let list = data ? data.list : record[0].list;

                list = JSON.parse(list);

                if (list.findIndex(it => it == req.user.id) >= 0) {
                    res.send(Status.getStatus('success', 'Successful', 'ok'));

                } else {
                    list.push(req.user.id);

                    Views.update({
                            list: JSON.stringify(list)
                        }, {
                            where: {
                                id: id

                            }
                        })
                        .then(update => {
                            res.send(Status.getStatus('success', 'Successful', 'ok'));
                        })
                        .catch(err => {
                            res.send(Status.getStatus('error', err.errors ? err.errors.map(it => it.message) : "Something went wrong"));
                        })


                }

            })
            .catch(err => {
                res.send(Status.getStatus('error', err.errors ? err.errors.map(it => it.message) : "Something went wrong"));
            })
    }

    statistic(req, res) {
        let provideAtributes = Helper.checkPostProvidedAttribute(req, res, ['type']);

        if (!provideAtributes) return;

        let configFind;

        switch (provideAtributes.type) {
            case 'year':
                configFind = {
                    createdAt: {
                        [Op.between]: this.rangeInYear()
                    }
                };
                break;

            default:
                break;
        }

        Views.findAll({
                where: configFind
            })
            .then(rs => {

                let results = {};

                switch (provideAtributes.type) {
                    case 'year':
                        monthInYears.forEach((it, index) => {
                            results[it] = {
                                month: index,
                                abbreviation: it,
                                views: 0
                            }
                        })

                        rs.forEach(it => {
                            let month = new Date(`${it.dataValues.createdAt}`).getMonth();
                            results[monthInYears[month]].views += (JSON.parse(it.list)).length;

                        })

                        break;

                    default:
                        break;
                }



                res.send(Status.getStatus('success', 'Successful', results));
            })
            .catch(err => {
                res.send(Status.getStatus('error', err.errors ? err.errors.map(it => it.message) : "Something went wrong"));
            })

    }

}

module.exports = new ViewController();