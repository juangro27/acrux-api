const { verifyToken } = require("../middlewares/verifyToken");
const Event = require("../models/Event.model");
const User = require("../models/User.model");
const router = require("express").Router();

router.get("/", async (req, res, next) => {
    let { limit: pageSize, skip } = req.query;
    pageSize = pageSize ? parseInt(pageSize) : 10;
    skip = skip ? parseInt(skip) : 0;

    try {
        const promises = [
            Event.count(),
            Event.find().limit(pageSize).skip(skip),
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
        host,
    } = req.body;
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
