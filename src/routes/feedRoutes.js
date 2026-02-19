const { Router } = require("express");
const { getFeeds } = require("../controllers/feedController");

const router = Router();

router.get("/", getFeeds);

module.exports = router;
