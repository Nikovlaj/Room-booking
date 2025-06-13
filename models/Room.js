const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String },
  capacity: { type: Number, required: true },
  type: { type: String, enum: ["workspace", "conference"], required: true },
});

const Room = mongoose.model("Room", roomSchema);

module.exports = Room;
