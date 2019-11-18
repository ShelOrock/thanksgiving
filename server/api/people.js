const router = require("express").Router();
const { Person, Dish } = require("../../db");

// make sure to use router.get, router.post etc..., instead of app.get, app.post, or etc... in this file.
// see https://expressjs.com/en/api.html#routers

router.get("/", (req, res, next) => {
    if(req.query.attending === 'true') {
        Person.findAll( {
            where: { attending: true }
        })
        .then(people => res.send(people))
    } else if(req.query.attending === 'false') {
        Person.findAll( {
            where: { attending: false }
        })
        .then(people => res.send(people))

    } else if(req.query.include_dishes === 'true') {
        Person.findAll( {
            include: Dish
        })
        .then(people => res.send(people))
    } else {
    Person.findAll()
    .then(people => res.send(people))
    }
});

router.get("/:id", (req, res, next) => {
    Person.findOne( {
        where: { id: req.params.id }
    })
    .then(person => res.send(person))
    .catch(e => console.log(e))
})

router.delete('/:id', (req, res, next) => {
    Person.findOne( {
        where: { id: req.param.id }
    } )
    .then((person) => res.send(person))
    .catch(e => console.log(e))
})

router.put('/:id', (req, res, next) => {
    Person.findOne( {
        where: { id: req.param.id }
    } )
    .then((person) => res.send(person))
    .catch(e => console.log(e))
})

router.post("/", (req, res, next) => {
    Person.create(req.body)
    .then(people => res.send(people))
    .catch(e => console.log(e))
})

module.exports = router;
