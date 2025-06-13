const express = require("express");
const router = express.Router();
const Room = require("../models/Room");
const auth = require("../middlewares/auth");
const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTTL: 300 });

// Hämta alla rum (för både User & Admin)
router.get("/", auth, async (req, res) => {
  try {
    const cachedRooms = cache.get("allRooms");
    if (cachedRooms) {
      console.log("Hämtar rum från cache");
      return res.json(cachedRooms);
    }
    const rooms = await Room.find();
    cache.set("allRooms", rooms);
    res.json(rooms);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Kunde inte hämta rum" });
  }
});

module.exports = router;
