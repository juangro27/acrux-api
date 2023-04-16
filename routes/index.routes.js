const router = require("express").Router();

const authRoutes = require("./auth.routes");
router.use("/auth", authRoutes);

const usersRoutes = require("./users.routes");
router.use("/users", usersRoutes);

const uploadRoutes = require("./upload.routes");
router.use("/upload", uploadRoutes);

const concertsRoutes = require("./concerts.routes");
router.use("/concerts", concertsRoutes);

module.exports = router;
