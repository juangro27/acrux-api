const { verifyToken } = require("../middlewares/verifyToken");
const Event = require("../models/Event.model");
const User = require("../models/User.model");
const router = require("express").Router();

router.get("/", async (req, res, next) => {
    const { country, city, date, address } = req.query;
    const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;

    let queries = {};

    if (country) queries.country = new RegExp(country, "i");
    if (city) queries.city = new RegExp(city, "i");
    if (address) queries.address = new RegExp(address, "i");
    if (date && date.match(dateRegex)) {
        const parsedDate = new Date(Date.parse(date));
        if (isNaN(parsedDate.getTime())) {
            res.status(400).json({
                errorMessage: "Invalid date format, please use mm/dd/yyyy",
            });
            return;
        }
        queries.date = {
            $gte: parsedDate,
            $lt: new Date(parsedDate.getTime() + 24 * 60 * 60 * 1000),
        };
    }

    try {
        const events = await Event.find(queries);
        res.json(events);
        return;
    } catch (err) {
        next(err);
    }
});

router.post("/create", verifyToken, async (req, res, next) => {
    const { name, address, city, country, images, price, date, host } =
        req.body;
    const { _id: owner } = req.payload;

    const dateParts = date.split("/");
    const dateObj = new Date(`${dateParts[2]}-${dateParts[0]}-${dateParts[1]}`);

    if (isNaN(dateObj.getTime())) {
        res.status(400).json({
            errorMessage: "Invalid date format, please use mm/dd/yyyy",
        });
        return;
    }
    const data = {
        name,
        address,
        city,
        country,
        images,
        price,
        date: dateObj,
        host,
        owner,
    };
    try {
        const event = await Event.create(data);
        res.json(event);
        return;
    } catch (err) {
        next(err);
    }
});

router.get("/:id", async (req, res, next) => {
    const { id } = req.params;
    try {
        const event = await Event.findById(id);
        res.json(event);
        return;
    } catch (err) {
        next(err);
    }
});

router.put("/:id/edit", verifyToken, async (req, res, next) => {
    const { id } = req.params;
    const { name, address, city, country, images, price, date, host } =
        req.body;
    const data = { name, address, city, country, images, price, date, host };
    try {
        const event = await Event.findByIdAndUpdate(id, data, {
            runValidators: true,
            new: true,
        });
        res.json(event);
        return;
    } catch (err) {
        next(err);
    }
});

router.delete("/:id/delete", verifyToken, async (req, res, next) => {
    const { id } = req.params;
    const promisesArr = [
        User.find({ favoriteEvents: id }),
        Event.findByIdAndDelete(id),
    ];

    try {
        const promises = await Promise.all(promisesArr);
        const [users] = promises;
        users.forEach(async ({ _id: userId }) => {
            User.findByIdAndUpdate(userId, { $pull: { favoriteEvents: id } });
        });
        res.json("Event deleted succesfully");
        return;
    } catch (err) {
        next(err);
    }
});

module.exports = router;