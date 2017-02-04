"use strict";

module.exports = function(Sequelize, DataTypes) {

    let User = Sequelize.define('user', {
        username: DataTypes.TEXT,
        password: DataTypes.TEXT,
        email: DataTypes.TEXT,
        role: {
            type: DataTypes.TEXT,
            defaultValue: 'AUTHOR'
        },
        displayname: DataTypes.TEXT,
        enabled: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    });

    return User;
};
