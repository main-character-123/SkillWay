const express = require("express");
const router = express.Router();
const { authMiddleware, allowedTo } = require("../Middlewares/authMiddleware");


const tracksControllers = require("../Controllers/tracksControllers");

router.route("/").get(tracksControllers.getAllTracks).post(authMiddleware, allowedTo('superAdmin', 'trackAdmin'), tracksControllers.addTrack);
router.route("/:id").delete(authMiddleware, allowedTo('superAdmin'), tracksControllers.deleteTrack).get(tracksControllers.getTrackById);

module.exports = router;
