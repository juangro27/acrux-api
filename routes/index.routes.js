const router = require("express").Router();

const authRoutes = require("./auth.routes");
router.use("/auth", authRoutes);

const usersRoutes = require("./users.routes");
router.use("/users", usersRoutes);

const eventsRoutes = require("./events.routes");
router.use("/events", eventsRoutes);

const uploadRoutes = require("./upload.routes");
router.use("/upload", uploadRoutes);

module.exports = router;
