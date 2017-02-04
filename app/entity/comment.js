"use strict";

module.exports = function(Sequelize, DataTypes) {

    let Comment = Sequelize.define('comment', {
        body: DataTypes.TEXT,
        authorname: DataTypes.TEXT,
        email: DataTypes.TEXT,
        authorid: DataTypes.INTEGER,
        messageid: DataTypes.INTEGER,
        approved: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    });

    return Comment;
};
