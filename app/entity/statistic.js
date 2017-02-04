"use strict";

module.exports = function(Sequelize, DataTypes) {

    let Statistic = Sequelize.define('statistic', {
        tablename: DataTypes.TEXT,
        statictic: DataTypes.TEXT,
        value: DataTypes.TEXT
    });

    return Statistic;
};
