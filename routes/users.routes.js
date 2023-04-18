const router = require("express").Router();
const User = require("../models/User.model");
const { verifyToken } = require("../middlewares/verifyToken");
const { default: mongoose } = require("mongoose");

router.get("/", verifyToken, async (req, res, next) => {
    let { limit: pageSize, skip } = req.query;
    pageSize = pageSize ? parseInt(pageSize) : 10;
    skip = skip ? parseInt(skip) : 0;

    try {
        const promises = [
            User.count(),
            User.find().select({ name: 1 }).limit(pageSize).skip(skip),
        ];
        const [count, users] = await Promise.all(promises);

        const totalPages = Math.ceil(count / pageSize) - 1;
        const pageNumber = Math.floor(skip / pageSize);
        const isFirst = skip === 0;
        const isLast = pageNumber === totalPages;

        res.json({
            totalElements: count,
            pageSize,
            skip,
            users,
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

router.put("/addEvent/:eventId", verifyToken, async (req, res, next) => {
    const { eventId } = req.params;
    const { _id } = req.payload;
    const id = new mongoose.Types.ObjectId(_id);
    try {
        const eventsId = await User.find({
            _id: id,
            favoriteEvents: eventId,
        });
        let event;
        if (eventsId.length) {
            event = await User.findByIdAndUpdate(
                id,
                { $pull: { favoriteEvents: eventId } },
                { new: true }
            );
        } else {
            event = await User.findByIdAndUpdate(
                id,
                { $push: { favoriteEvents: eventId } },
                { new: true }
            );
        }
        res.json(event);
    } catch (err) {
        next(err);
    }
});

router.get("/:id", async (req, res, next) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id);
        res.json(({ _id, name, lastName, role, email, favoriteEvents } = user));
    } catch (err) {
        next(err);
    }
});

router.put("/:id/edit", verifyToken, async (req, res, next) => {
    const { id } = req.params;
    const { name, lastName } = req.body;
    try {
        const user = await User.findByIdAndUpdate(
            id,
            { name, lastName },
            { runValidators: true, new: true }
        );

        const authToken = user.signToken();
        res.status(200).json({ authToken });
    } catch (err) {
        next(err);
    }
});

router.delete("/:id/delete", verifyToken, async (req, res, next) => {
    const { id } = req.params;
    try {
        await User.findByIdAndDelete(id);
        res.json("User deleted succesfully");
    } catch (err) {
        next(err);
    }
});

module.exports = router;
