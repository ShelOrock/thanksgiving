const Sequelize = require('sequelize');
const { db } = require('../connection');
const { STRING } = Sequelize;

const Dish = db.define('dish', {
    name: {
        type: STRING,
        allowNull: false,
        unique: true,
    },

    description: {
        type: STRING,
        allowNull: false,
        unique: true,
    }
});

module.exports = { Dish };
