const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const checkRole = require("../middlewares/roles");
const User = require("../models/User");
const Booking = require("../models/Booking");
const Room = require("../models/Room");
const adminOnly = [auth, checkRole("Admin")];

router.post("/rooms", adminOnly, async (req, res) => {
  try {
    const { name, type, capacity } = req.body;
    const room = new Room({ name, type, capacity });
    await room.save();
    res.status(201).json({ message: "Rum skapat", room });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Kunde inte skapa rum" });
  }
});

router.put("/rooms/:id", adminOnly, async (req, res) => {
  try {
    const updatedRoom = await Room.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedRoom)
      return res.status(404).json({ message: "Rummet finns inte" });
    res.json({ message: "Rum uppdaterat", updatedRoom });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Kunde inte uppdatera rum" });
  }
});

router.delete("/rooms/:id", adminOnly, async (req, res) => {
  try {
    const deleted = await Room.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Rummet finns inte" });
    res.json({ message: "Rummet borttaget" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Kunde inte ta bort rum" });
  }
});

router.get("/users/bookings", adminOnly, async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("userId", "username role")
      .populate("roomId", "name location");
    res.json({ bookings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Kunde inte hämta bokningar" });
  }
});

router.delete("/users/:id", adminOnly, async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser)
      return res.status(404).json({ message: "Användare finns inte" });
    await Booking.deleteMany({ userid: req.params.id });
    res.json({ message: "Användare och bokningar borttagna" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Kunde inte ta bort användare" });
  }
});

module.exports = router;
