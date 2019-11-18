const { app } = require('./app');
const PORT = 3000;
const { db, Person, Dish } = require('../db');

async function syncAndSeedDatabase() {
  try {
    await db.sync({ force: true });
    const people = [
            {
                name: 'Bella Goth',
                attending: true,
            },
            {
                name: 'Mortimer Goth',
                attending: true,
            },
            {
                name: 'Cassandra Goth',
            },
        ]

        const [ bella, mortimer, cassandra ] = await Promise.all(people.map(person => Person.create(person)));

        const dishes = [
            { 
                name: 'Salmon en croute',
                description: 'Our straightforward recipe makes light work of the tricky salmon en croûte. Serve this French classic as the centre piece at special gatherings with family and friends.',
                personId: bella.id,
            },
            {
                name: 'Sardines with crisp paprika crumbs',
                description: 'A sardine is a very small, oily fish. You might like to eat sardines on toast for lunch. If you do, we suggest an after-lunch mint may be in order.',
                personId: mortimer.id,
            },
            {
                name: 'Escarole, cannellini bean and tomato salad',
                description: 'Escarole has broad, slightly curly, pale green leaves with a nutty, bitter taste similar to that of curly endive only with a less bitter bite. The fleshy, dark, outer leaves are more bitter in flavor than the lighter, inner leaves',
                personId: mortimer.id,
            },
        ]

        await Promise.all(dishes.map(dish => Dish.create(dish)));
    

  } catch (e) {
    console.log(e);
  }

  console.log('done seeding and associating!');
}

syncAndSeedDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
  });
});
