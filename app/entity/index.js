"use strict";

let fs = require("fs");
let path = require("path");
let Sequelize = require("sequelize");
let config = require('../config/config.js');

let seqOptions = {
    define: {
        schema: config.database.schema,
        freezeTableName: true,
        createdAt: 'createdat',
        updatedAt: 'updatedat'
    }
}

let sequelize = new Sequelize(config.database.uri, seqOptions);
let env = process.env.NODE_ENV || "development";
let db = {};

fs.readdirSync(__dirname)
    .filter(function (file) {
        return (file.indexOf(".") !== 0) && (file !== "index.js");
    })
    .forEach(function (file) {
        let model = sequelize.import(path.join(__dirname, file));
        db[model.name] = model;
    });

Object.keys(db).forEach(function (modelName) {
    if ("associate" in db[modelName]) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
