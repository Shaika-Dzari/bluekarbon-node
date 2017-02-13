"use strict";

module.exports = function(Sequelize, DataTypes) {

    let Statistic = Sequelize.define('statistic', {
        tablename: DataTypes.TEXT,
        statistic: DataTypes.TEXT,
        value: DataTypes.TEXT
    });

    return Statistic;
};
