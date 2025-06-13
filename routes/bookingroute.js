const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const Booking = require("../models/Booking");

router.post("/", auth, async (req, res) => {
  try {
    const { roomId, startTime, endTime } = req.body;
    const mongoose = require("mongoose");

    if (!mongoose.Types.ObjectId.isValid(roomId)) {
      return res.status(400).json({ message: "Ogiltigt rum-ID" });
    }

    if (!roomId || !startTime || !endTime) {
      return res.status(400).json({ message: "Alla fält krävs" });
    }

    // Kontrollera om tiden krockar
    const overlapping = await Booking.findOne({
      roomId,
      $or: [
        {
          startTime: { $lt: new Date(endTime) },
          endTime: { $gt: new Date(startTime) },
        },
      ],
    });

    if (overlapping) {
      return res.status(409).json({ message: "Rum upptaget" });
    }

    const booking = new Booking({
      userId: req.user.userid,
      roomId: roomId,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
    });
    await booking.save();
    const io = req.app.get("io");
    io.emit("bookingCreated", {
      message: "Bokning skapad",
      booking,
    });

    res.status(201).json({ message: "Rum bokat", booking });
  } catch (err) {
    console.error("POST /bookings error:", err);
    res.status(500).json({ message: "Bokning misslyckades" });
  }
});
router.get("/", auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.userid }).populate(
      "roomId",
      "name location"
    );
    res.status(200).json({ bookings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Kunde inte hämta bokningar" });
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    const { roomId, startTime, endTime } = req.body;

    // Kontrollera att alla fält finns
    if (!roomId || !startTime || !endTime) {
      return res.status(400).json({ message: "Alla fält krävs" });
    }

    // Hämta bokningen från DB
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Ingen sådan bokning" });
    }

    // Kontrollera behörighet
    if (
      booking.userId.toString() !== req.user.userid &&
      req.user.role !== "Admin"
    ) {
      return res
        .status(403)
        .json({ message: "Ingen åtkomst att uppdatera denna bokning" });
    }

    // Kontrollera överlappning
    const overlapping = await Booking.findOne({
      _id: { $ne: req.params.id },
      roomId,
      startTime: { $lt: new Date(endTime) },
      endTime: { $gt: new Date(startTime) },
    });

    if (overlapping) {
      return res
        .status(409)
        .json({ message: "Tiden är redan bokad av någon annan" });
    }

    // Uppdatera bokningen direkt och spara
    booking.roomId = roomId;
    booking.startTime = new Date(startTime);
    booking.endTime = new Date(endTime);
    await booking.save();

    const io = req.app.get("io");
    io.emit("bookingUpdated", {
      message: "Bokning updaterad",
      booking,
    });

    res.status(200).json({ message: "Bokning uppdaterad", booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Kunde inte uppdatera bokning" });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const filter =
      req.user.role === "Admin"
        ? { _id: req.params.id }
        : { _id: req.params.id, userId: req.user.userid };

    const booking = await Booking.findOneAndDelete(filter);

    if (!booking) {
      return res.status(404).json({ message: "Bokning kunde inte hittas" });
    }
    const io = req.app.get("io");
    io.emit("bookingDeleted", {
      message: "Bokning borttagen",
      booking,
    });

    res.status(200).json({ message: "Bokning borttagen" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Kunde inte ta bort bokning" });
  }
});
module.exports = router;
