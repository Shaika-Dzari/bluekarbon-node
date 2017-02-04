"use strict";

module.exports = function(Sequelize, DataTypes) {

    let Module = Sequelize.define('module', {
        code: DataTypes.TEXT,
        name: DataTypes.TEXT,
        moduleorder: DataTypes.INTEGER,
        enablemodule: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        enablecomment: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        enablecategory: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    });

    return Module;
};
