const router = require("express").Router();
const { Dish, Person } = require("../../db");

// make sure to use router.get, router.post etc..., instead of app.get, app.post, or etc... in this file.
// see https://expressjs.com/en/api.html#router

router.get("/", (req, res, next) => {
    if(req.query.include_people === 'true') {
    Dish.findAll( {
        include: Person
    })
    .then(dishes => res.send(dishes))
    } else {
        Dish.findAll()
        .then(dishes => res.send(dishes));
    }
});

router.get("/:id", (req, res, next) => {
    Dish.findOne( {
        where: { id: req.params.id }
    })
    .then(dish => res.send(dish))
    .catch(next)
});

module.exports = router;
