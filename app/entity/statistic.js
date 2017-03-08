"use strict";

module.exports = function(Sequelize, DataTypes) {

    let Statistic = Sequelize.define('statistic', {
        tablename: DataTypes.TEXT,
        statname: DataTypes.TEXT,
        value: DataTypes.TEXT
    });

    return Statistic;
};
