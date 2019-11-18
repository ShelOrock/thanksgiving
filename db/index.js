const { db } = require('./connection');
const { Dish } = require('./models/Dish');
const { Person } = require('./models/Person');

Person.hasMany(Dish);
Dish.belongsTo(Person);

module.exports = {
  db,
  Dish,
  Person,
};
