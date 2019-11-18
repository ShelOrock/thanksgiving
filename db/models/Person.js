const Sequelize = require('sequelize');
const { db } = require('../connection');
const { STRING, BOOLEAN } = Sequelize

const Person = db.define('person', {
    name: {
        type: STRING,
        allowNull: false,
        unique: true,
    },

    attending: {
        type: BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
});

module.exports = { Person };
