const router = require("express").Router();

const uploader = require("../middlewares/uploader.middleware");

router.post("/image", uploader.array("images", 6), (req, res, next) => {
    if (!req.files || req.files.length === 0) {
        return res.sendStatus(200);
    } else {
        const urls = req.files.map(({ path }) => path);
        res.json({ cloudinary_url: urls });
    }
});

module.exports = router;
