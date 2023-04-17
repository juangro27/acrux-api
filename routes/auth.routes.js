const router = require("express").Router();
const User = require("../models/User.model.js");

const { verifyToken } = require("../middlewares/verifyToken");

router.post("/signup", async (req, res, next) => {
    const { name, lastName, email, password } = req.body;
    try {
        const emailUsed = await User.findOne({ email });

        if (emailUsed) {
            res.status(401).json({ errorMessages: ["Email in use."] });
            return;
        } else {
            await User.create({ email, password, name, lastName });
            res.sendStatus(201);
            return;
        }
    } catch (err) {
        next(err);
    }
});

router.post("/login", async (req, res, next) => {
    const { email, password } = req.body;

    if (email === "" || password === "") {
        res.status(400).json({
            errorMessages: ["Provide email and password."],
        });
        return;
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            res.status(401).json({
                errorMessages: ["Invalid email or password"],
            });
            return;
        }

        if (user.validatePassword(password)) {
            const authToken = user.signToken();
            res.status(200).json({ authToken });
            return;
        } else {
            res.status(401).json({
                errorMessages: ["Invalid email or password"],
            });
            return;
        }
    } catch (err) {
        next(err);
    }
});

router.get("/verify", verifyToken, (req, res, next) => {
    res.json(req.payload);
    return;
});

module.exports = router;
