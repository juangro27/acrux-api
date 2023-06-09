const { verifyToken } = require("../middlewares/verifyToken");
const Event = require("../models/Event.model");
const User = require("../models/User.model");
const router = require("express").Router();

router.get("/", async (req, res, next) => {
    const { country, city, date, address, hosts } = req.query;
    const dateRegex = /^\d{4}-\d{2}-\d{2}/;
    let { limit: pageSize, skip } = req.query;
    pageSize = pageSize ? parseInt(pageSize) : 12;
    skip = skip ? parseInt(skip) : 0;

    let queries = {};

    if (country) queries.country = new RegExp(country, "i");

    if (city) queries.city = new RegExp(city, "i");

    if (hosts) queries.hosts = new RegExp(hosts, "i");

    if (address) queries.address = new RegExp(address, "i");

    if (date && date.match(dateRegex)) {
        const [year, month, day] = date.split("-");
        const parsedDate = new Date(`${year}/${month}/${day}`);
        if (isNaN(parsedDate.getTime())) {
            res.status(400).json({
                errorMessages: "Invalid date format, please use yyyy-mm-dd",
            });
            return;
        }

        queries.date = {
            $gte: parsedDate,
            $lt: new Date(parsedDate.getTime() + 24 * 60 * 60 * 1000),
        };
    }

    try {
        const promises = [
            Event.find(queries).count(),
            Event.find(queries).limit(pageSize).skip(skip),
        ];
        const [count, events] = await Promise.all(promises);
        const totalPages = Math.ceil(count / pageSize) - 1;
        const pageNumber = Math.floor(skip / pageSize);
        const isFirst = skip === 0;
        const isLast = pageNumber === totalPages;

        res.json({
            totalElements: count,
            pageSize,
            skip,
            events,
            totalPages,
            pageNumber,
            isFirst,
            isLast,
        });
        return;
    } catch (err) {
        next(err);
    }
});

router.post("/create", verifyToken, async (req, res, next) => {
    const {
        name,
        address,
        city,
        description,
        country,
        images,
        price,
        date,
        hosts,
    } = req.body;
    const { _id: owner } = req.payload;

    const [year, month, day] = date.split("-");
    const parsedDate = new Date(`${year}/${month}/${day}`);
    if (isNaN(parsedDate.getTime())) {
        res.status(400).json({
            errorMessages: "Invalid date format, please use yyyy-mm-dd",
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
        date: parsedDate,
        hosts,
        owner,
        description,
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
