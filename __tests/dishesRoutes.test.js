// tests for /api/dishes

// supertest is a module that allows us to test our express server
const request = require('supertest');
const { app } = require('./../server/app.js');
const { db, Dish, Person } = require('./../db/index.js');

beforeEach(async done => {
  // wipe the db before each test block
  await db.sync({ force: true });
  done();
});
afterAll(async done => {
  // close the db connection upon completion of all tests
  await db.close();
  done();
});
describe('/api/dishes routes', () => {
  const person1 = { name: 'mark', isAttending: true };
  const person2 = { name: 'russell', isAttending: false };
  const person3 = { name: 'ryan', isAttending: true };

  const dish1 = { name: 'turkey', description: 'delicious briney turkey' };
  const dish2 = { name: 'pie', description: 'delicious pumpkiney pie' };

  // its up to you to create the test conditions for /api/dishes
  // add as many tests as you feel necessary to fully cover each routes functionality
  describe('GET to /api/dishes', () => {
    it('should retrieve all people if no params are given', () => {
      return Promise.all([Dish.create(dish1), Dish.create(dish2)])
      .then(() => {
        request(app)
        .get('/api/dishes/')
        .expect('Content-Type', /json/)
        .expect(200)
        .then(response => {
          const dishes = response.body;
          expect(dishes.length).toBe(2);
          expect(dishes).toEqual(
            expect.arrayContainer([
              expect.objectContaining(dish1),
              expect.objectContaining(dish2),
            ])
          );
        })
      });
    });

    it('should return dishes and their People using include_people=true query string', async () => {
        const [mark, russell, ryan] = await Promise.all([
          Person.create(person1),
          Person.create(person2),
          Person.create(person3),
        ]);

        const [turk, pie] = await Promise.all([
          Dish.create({ ...dish1, personId: mark.id }),
          Dish.create({ ...dish2, personId: ryan.id }),
        ]);
        
        await request(app)
          .get('/api/people/?include_people=true')
          .expect('Content-Type', /json/)
          .expect(200)
          .then(response => {
            const people = response.body;
            expect(people.length).toBe(2);
            expect(people).toEqual(
              expect.arrayContainer([
                expect.objectContaining(dish1,
                  expect.arrayContainer([
                    expect.objectContaining(person1)
                  ])),
                    expect.objectContainer(
                      expect.objectContaining(dish3,
                        expect.arrayContainer([
                          expect.objectContainer(person3)
                  ])),
                )
              ])
            )
          })
        })
    })

  describe('GET to /api/dishes/:id', () => {
    it('should return the dish with an id matching the parameterized route', async () => {
        const [mark, russell, ryan] = await Promise.all([
          Person.create(person1),
          Person.create(person2),
          Person.create(person3),
        ]);

        const [turk, pie] = await Promise.all([
          Dish.create({ ...dish1, personId: mark.id }),
          Dish.create({ ...dish2, personId: ryan.id }),
        ]);
        await request(app)
          .get('/api/dishes/1')
          .expect('Content-Type', /json/)
          .expect(200)
          .then(response => {
            const dish = response.body;
            exect(dish.length).toBe(1);
            expect(dish).toEqual(
              expect.arrayContaining([
                expect.objectContainer(dish1)
              ])            
            )
          })
    });
  });

  describe('POST to /api/dishes/',  () => {
    it('should create a new dish and return that dishs information if all the required information is given', async() => {
        const postRequest = await Dish.create( { name: 'poop', description: 'yummy' })
        await request(app)
          .post('/api/dishes')
          .expect('Content-Type', /json/)
          .expect(202)
          .then(response => {
            const dishes = response.body;
            expect(dishes.length).toBe(1);
            expect(dishes).toEqual(
              expect.arrayContainer([
                expect.objectContainer(postRequest)
              ])
            );
          })
    });

    it('should return status code 400 if missing required information', async () => {

        const postRequest = await Dish.create( { name: 'poop', description: 'yummy' } )
        await request(app)
          .post('/api/dishes')
          .expect('Content-Type', /json/)
          .expect(400)
          .then(response => {
            expect(dishes.length).toBe(0);
          })
    });
  });

  describe('PUT to /api/dishes/:id', () => {
    it('should update a dishs information', async () => {
        const [mark, russell, ryan] = await Promise.all([
          Person.create(person1),
          Person.create(person2),
          Person.create(person3),
        ]);

        const [turk, pie] = await Promise.all([
          Dish.create({ ...dish1, personId: mark.id }),
          Dish.create({ ...dish2, personId: ryan.id }),
        ]);

        const updateRequest = { id: 1, name: 'meow', attending: true }

        await request(app)
          .put('/api/dishes/1')
          .expect('Content-Type', "text/html; charset=utf-8")
          .expect(202)
          .then(response => {
            const dishes = dishes.body;
            expect(dishes.length).toBe(2);
            expect(dishes).toEqual(
              expect.arrayContaining([
                expect.objectContaining(updateRequest),
                expect.objectContaining(dish2),
              ])
            );
          })
    });
  });

  describe('DELETE to /api/dishes/:id', () => {
    it('should remove a dish from the database', async () => {

        const [mark, russell, ryan] = await Promise.all([
          Person.create(person1),
          Person.create(person2),
          Person.create(person3),
        ]);

        const [turk, pie] = await Promise.all([
          Dish.create({ ...dish1, personId: mark.id }),
          Dish.create({ ...dish2, personId: ryan.id }),
        ]);

        await request(app)
          .delete('/api/dishes/1')
          .expect('Content-Type', "text/html; charset=utf-8")
          .expect(202)
          .then(response => {
            const dishes = dishes.body;
            expect(dishes.length).toBe(1);
            expect(dishes).toEqual(
              expect.arrayContaining([
                expect.objectContaining(dish2),
              ])
            );
          })
        });
    });
  });

//ok i hate this