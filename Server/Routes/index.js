const express = require("express");
const router = express.Router();
const { createRoom, joinRoom } = require("../Controllers/createroom");

router.post("/createroom", createRoom)
// router.post("/joinroom", joinRoom)

module.exports = router;