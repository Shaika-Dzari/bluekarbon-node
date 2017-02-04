"use strict";

module.exports = function(Sequelize, DataTypes) {
    let Category = Sequelize.define('category', {
        name: DataTypes.TEXT,
        description: DataTypes.TEXT,
        moduleid: DataTypes.INTEGER
    }/*, {schema: 'nakama'}*/);

    return Category;
};
