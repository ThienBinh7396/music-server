'use strict';
module.exports = (sequelize, DataTypes) => {
    const Employees = sequelize.define('Employees', {
        name: DataTypes.STRING,
        email: DataTypes.STRING,
        password: DataTypes.STRING,
        address: DataTypes.STRING,
        phone: DataTypes.STRING,
        thumbnail: DataTypes.TEXT
    }, {});
    Employees.associate = function(models) {
        // associations can be defined here
    };
    return Employees;
};