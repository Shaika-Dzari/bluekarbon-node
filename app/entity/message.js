"use strict";

module.exports = function(Sequelize, DataTypes) {
    let Message = Sequelize.define('message', {
        title: DataTypes.TEXT,
        body: DataTypes.TEXT,
        published: DataTypes.BOOLEAN,
        authorname: DataTypes.TEXT,
        authorid: DataTypes.INTEGER,
        prettyurl: DataTypes.TEXT,
        categories: DataTypes.JSONB,
        moduleid: DataTypes.INTEGER
    });

    return Message;
};
