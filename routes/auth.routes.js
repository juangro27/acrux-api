const router = require("express").Router();
const User = require("../models/User.model.js");

const { verifyToken } = require("../middlewares/verifyToken");

router.post("/signup", (req, res, next) => {
    const { name, lastName, email, password } = req.body;

    User.findOne({ email })
        .then((foundUser) => {
            if (foundUser) {
                res.status(401).json({ errorMessages: ["Email in use."] });
                return;
            } else {
                return User.create({ email, password, name, lastName });
            }
        })
        .then(() => res.sendStatus(201))
        .catch((err) => next(err));
});

router.post("/login", (req, res, next) => {
    const { email, password } = req.body;

    if (email === "" || password === "") {
        res.status(400).json({
            errorMessages: ["Provide email and password."],
        });
        return;
    }

    User.findOne({ email })
        .then((foundUser) => {
            if (!foundUser) {
                res.status(401).json({
                    errorMessages: ["Invalid email or password"],
                });
                return;
            }

            if (foundUser.validatePassword(password)) {
                const authToken = foundUser.signToken();
                res.status(200).json({ authToken });
            } else {
                res.status(401).json({
                    errorMessages: ["Invalid email or password"],
                });
            }
        })
        .catch((err) => next(err));
});

router.get("/verify", verifyToken, (req, res, next) => {
    res.json(req.payload);
});

module.exports = router;
