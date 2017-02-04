"use strict";

module.exports = function(Sequelize, DataTypes) {
    let File = Sequelize.define('file', {
        name: DataTypes.TEXT,
        filepath: DataTypes.TEXT,
        contenttype: DataTypes.TEXT,
        ownerid: DataTypes.INTEGER,
        ownername: DataTypes.TEXT,
        ispublic: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    });

    return File;
};
